
import json

import matplotlib.pyplot as plt
from flask import Flask, request
from flask_cors import CORS
from model import run_model


app = Flask(__name__)
CORS(app)
settings = {}

@app.post("/post")
def handle_post():
    settings = request.get_json()
    print(settings)
    prediction, before_flux = run_model(settings)
    plt.figure(figsize=(10, 6))
    plt.plot(before_flux, label='Proton Flux Real')
    plt.plot(range(len(before_flux), len(before_flux) + len(prediction)), prediction, label='Proton Flux Predictions')
    plt.axvline(x=len(before_flux) - 1, color='r', linestyle='--', label='Forecast Horizon')
    plt.xlabel('Time Steps (1H)')
    plt.ylabel('Proton Flux >10 MeV')
    plt.title('Real-Time Data vs Predictions')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig("C:\\Users\\Quasi\\Documents\\Hackathon\\public\\image.png")
    plt.close()
    print(prediction, before_flux)
    return json.dumps({})


if __name__ == "__main__":
    app.run(debug=True, port=80)
