import pandas
import pandas as pd
from darts.models import TFTModel, RNNModel
from pytorch_lightning.callbacks import EarlyStopping
from darts import TimeSeries
from darts.dataprocessing.transformers import Scaler
from darts.metrics import mae, mse
from parse import parse
from parse_live_noaa import parse_noaa
import numpy as np

def inverse_scaler(arr, train_arr):
    std = np.std(train_arr)
    mean = np.mean(train_arr)
    return (arr + mean) * std/np.std(arr)

def run_model(settings):
    training = pd.read_csv("final_data.csv")
    training["datetime"] = pd.to_datetime(training["datetime"], format="%Y-%m-%d-%H%M")
    training = training.set_index("datetime")
    print(training)
    # Proton flux is the target, so we create a ts
    t_proton_series = TimeSeries.from_dataframe(training, value_cols="flux")
    t_associated_series = TimeSeries.from_dataframe(training,
                                                  value_cols=["elec_38_53", "elec_175_315", "status_p", "prot_47_68",
                                                              "prot_115_195", "anisotropy"], freq="1h")

    proton_live_data = parse_noaa()
    electron_live_data = parse("https://sohoftp.nascom.nasa.gov/sdb/goes/ace/monthly/202506_ace_epam_1h.txt")
    electron_live_data = electron_live_data.tail(len(proton_live_data))

    combined_data = pd.concat([proton_live_data, electron_live_data], axis=1)
    combined_data["datetime"] = pd.to_datetime(combined_data.index)
    combined_data = combined_data.set_index("datetime")

    l_proton_series = TimeSeries.from_dataframe(combined_data, value_cols="flux", freq="1h", fill_missing_dates=True)
    l_associated_series = TimeSeries.from_dataframe(combined_data,
                                                    value_cols=["elec_38_53", "elec_175_315", "status_p", "prot_47_68",
                                                                "prot_115_195", "anisotropy"], freq="1h", fill_missing_dates=True)


    transformer = Scaler()
    t_associated_series = transformer.fit_transform(t_associated_series)
    l_associated_series = transformer.transform(l_associated_series)

    transformer2 = Scaler()
    t_proton_series = transformer2.fit_transform(t_proton_series)
    l_proton_series = transformer2.transform(l_proton_series)

    t_train, t_val = t_proton_series.split_after(0.9)
    cov_train, cov_val = t_associated_series.split_after(0.9)

    early_stopper = EarlyStopping(
        monitor="train_loss",
        patience=5,
        min_delta=0.01,
        mode='min',
    )
    model = TFTModel(
        input_chunk_length=int(settings["input_chunk_length"]),
        output_chunk_length=int(settings["output_chunk_length"]),
        dropout=float(settings["dropout"]),
        batch_size=settings["dimension_of_embedding_vectors"], # YES I KNOW THIS IS WIERD BUT TRUST ME
        random_state=42,
        n_epochs=int(settings["epochs"]),
        pl_trainer_kwargs={"gradient_clip_val": 0.5, "callbacks": [early_stopper]}
    )

    model_for_covariates = RNNModel(
        model='LSTM',
        input_chunk_length=3,
        output_chunk_length=3,
        hidden_dim=25,
        n_rnn_layers=2,
        dropout=0.2,
        batch_size=16,
        n_epochs=1,
        random_state=42,
        optimizer_kwargs={"lr": 1e-3},
        model_name="rnn_forecast",
    )

    model_for_covariates.fit(cov_train, val_series=cov_val, verbose=True)
    future_covariates = model_for_covariates.predict(n=int(settings["horizon"]) + 4, series=l_associated_series)
    context = l_proton_series[-int(settings["input_chunk_length"]):]


    model.fit(
        future_covariates=cov_train,
        series=t_train
    )
    prediction = model.predict(
        n=int(settings["horizon"]),
        series=context,
        future_covariates=l_associated_series.append(future_covariates)
    )
    regular = transformer2.inverse_transform(l_proton_series).values()
    prediction = inverse_scaler(prediction.values(), regular)
    return prediction, regular

