
import pandas as pd
import requests

def parse_noaa():
    url = "https://services.swpc.noaa.gov/json/goes/primary/integral-protons-3-day.json"
    data = requests.get(url).json()

    def above_10mev(item):
        if item["energy"] == ">=10 MeV":
            return True
        return False

    filtered = [item for item in data if above_10mev(item)]

    df = pd.DataFrame(filtered)
    df = df.drop(["satellite", "energy"], axis=1)
    df["time_tag"] = pd.to_datetime(df["time_tag"], format="%Y-%m-%dT%H:%M:%SZ")
    df.set_index("time_tag", inplace=True)
    hour_avg = df.resample("1h").mean()
    return hour_avg.head(len(hour_avg) - 1)
