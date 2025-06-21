
import re
import pandas as pd
import requests

url = "https://omniweb.gsfc.nasa.gov/staging/omni_goes_sis_brTsHNnLbr.lst"
ascii_text = requests.get(url).text

lines = []
for line in ascii_text.split("\n"):
    line = re.split(r"\s+", line)
    lines.append(line[-1])

columns = "flux".split()
lines.pop(-1)
df = pd.DataFrame(data=lines)
omnidf = pd.read_csv("parsed_ace_epam.csv")
df = pd.concat([df, omnidf], axis=1)
df.to_csv("final_data.csv", index=False)
