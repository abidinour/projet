from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import scipy.sparse as sp
import os

from attack_detector import detect_attack_type

app = FastAPI()

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

model = joblib.load(os.path.join(MODELS_DIR,"best_model.pkl"))
vectorizer = joblib.load(os.path.join(MODELS_DIR,"vectorizer.pkl"))
scaler = joblib.load(os.path.join(MODELS_DIR,"scaler.pkl"))


class RequestData(BaseModel):
    url: str
    content: str = ""


def extract_features(url, content):

    url = str(url)
    content = str(content)

    return [
        len(url),
        len(content),
        sum(c in "!@#$%^&*()=+[]{}|;:',.<>?/\\" for c in url),
        int(any(x in url.lower() for x in ["select","union","drop","delete","insert"])),
        int(any(x in url.lower() for x in ["<script","alert","javascript"])),
        url.count("&")
    ]


@app.get("/")
def home():
    return {"message":"AI API running"}


@app.post("/predict")
def predict(data:RequestData):

    attack_type = detect_attack_type(data.url,data.content)

    if attack_type != "unknown_attack":

        return {
            "url":data.url,
            "prediction":"attack",
            "attack_type":attack_type,
            "confidence":0.95
        }

    text = data.url + " " + data.content

    text_vec = vectorizer.transform([text])

    num = extract_features(data.url,data.content)

    num_scaled = scaler.transform([num])

    X = sp.hstack([text_vec,sp.csr_matrix(num_scaled)])

    pred = model.predict(X)[0]

    if pred == 1:

        return {
            "url":data.url,
            "prediction":"attack",
            "attack_type":"unknown_attack",
            "confidence":0.75
        }

    return {
        "url":data.url,
        "prediction":"normal",
        "confidence":0.90
    }