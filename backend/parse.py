import pandas
import pandas as pd
import requests
import re
import warnings

warnings.filterwarnings("ignore")

def parse(url):
    text = requests.get(url).text
    lines = []
    for line in text.split("\n"):
        if len(line) != 0 and not line[0] == ":" and not line[0] == "#":
            line = re.split(r"\s+", line)
            lines.append(line)

    columns = ["year", "month", "day", "hhmm", "julian_day", "mod_seconds", "status_e", "elec_38_53", "elec_175_315", "status_p", "prot_47_68", "prot_115_195", "prot_310_580", "prot_795_1193", "prot_1060_1900", "anisotropy"]

    df = pd.DataFrame(lines, columns=columns)
    df["datetime"] = pandas.to_datetime(df[["year", "month", "day", "hhmm"]].agg("-".join, axis=1), format="%Y-%m-%d-%H%M")
    df.set_index('datetime', inplace=True)
    try:
        create = pd.read_csv("parsed_ace_epam.csv")
        df = pd.concat([create, df])
    except:
        print("creating a new file")


    df = df.drop(["year", "month", "day", "hhmm", "julian_day", "mod_seconds", "prot_310_580", "prot_795_1193", "prot_1060_1900"], axis=1)
    return df


