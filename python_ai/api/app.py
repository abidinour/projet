from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import scipy.sparse as sp
import os

app = FastAPI()

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

model = joblib.load(os.path.join(MODELS_DIR, "best_model.pkl"))
vectorizer = joblib.load(os.path.join(MODELS_DIR, "vectorizer.pkl"))
scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))


class PredictionRequest(BaseModel):
    message: str


def extract_features(text):
    text = str(text)
    return [
        len(text),
        0,
        text.count("&"),
        text.count("="),
        text.count("?"),
        sum(c.isdigit() for c in text),
        sum(c in "!@#$%^&*()" for c in text),
        int("../" in text or "..\\" in text),
        int("<script" in text.lower()),
        int("select" in text.lower()),
        int("union" in text.lower()),
        int("drop" in text.lower())
    ]


def detect_attack_type(msg):
    msg = msg.lower()

    if any(x in msg for x in ["or 1=1", "union select", "drop table", "admin'", "select *"]):
        return "SQL Injection", 0.98

    if any(x in msg for x in ["<script>", "alert(", "onerror=", "<img"]):
        return "XSS", 0.97

    if any(x in msg for x in ["brute force", "password attack", "login attack"]):
        return "Brute Force", 0.94

    if any(x in msg for x in ["../", "..\\"]):
        return "Path Traversal", 0.92

    return "Suspicious Attack", 0.90


@app.get("/")
def root():
    return {"message": "AI Detection API Running"}


@app.post("/predict")
def predict(data: PredictionRequest):
    message = data.message

    text_features = vectorizer.transform([message])
    numeric_features = np.array([extract_features(message)])
    numeric_scaled = scaler.transform(numeric_features)

    final_input = sp.hstack([
        text_features,
        sp.csr_matrix(numeric_scaled)
    ])

    prediction = str(model.predict(final_input)[0])

    is_attack = prediction.lower() in ["anomalous", "attack", "malicious", "1"]

    if is_attack:
        attack_type, confidence = detect_attack_type(message)
        result = "⚠️ Suspicious Attack Detected"
        risk = "High Risk"
    else:
        attack_type = "Normal Request"
        confidence = 0.95
        result = "✅ Normal Safe Request"
        risk = "Low Risk"

    return {
        "prediction": prediction,
        "result": result,
        "risk": risk,
        "attack_type": attack_type,
        "confidence": confidence
    }
