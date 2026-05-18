from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import scipy.sparse as sp
import os

from attack_detector import detect_attack_type   # ← import shared detector

app = FastAPI()

BASE_DIR   = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

model      = joblib.load(os.path.join(MODELS_DIR, "best_model.pkl"))
vectorizer = joblib.load(os.path.join(MODELS_DIR, "vectorizer.pkl"))
scaler     = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))


class PredictionRequest(BaseModel):
    message: str


# ===============================
# Feature Extraction  ← FIXED
# ===============================
def extract_features(text):
    text     = str(text)
    combined = text.lower()                      # ← was missing before

    return [
        len(text),
        0,
        text.count("&"),
        text.count("="),
        text.count("?"),
        sum(c.isdigit() for c in text),
        sum(c in "!@#$%^&*()" for c in text),
        int("../" in text or "..\\" in text),
        int("<script" in combined),
        int("select" in combined),
        int("union"  in combined),
        int("drop"   in combined),               # ← comma was missing here
        int("http://"  in combined),
        int("https://" in combined),
        int("ftp://"   in combined),
        int("etc/passwd" in combined),
        int(";ls" in combined or "|whoami" in combined),
    ]


@app.get("/")
def root():
    return {"message": "AI Detection API Running"}


@app.post("/predict")
def predict(data: PredictionRequest):
    message = data.message

    # Rule-based check first
    attack_type = detect_attack_type(message)

    if attack_type != "none":
        return {
            "prediction":  "1",
            "result":      "⚠️ Attack Detected",
            "risk":        "High Risk",
            "attack_type": attack_type,
            "confidence":  0.95
        }

    # ML fallback
    text_features    = vectorizer.transform([message])
    numeric_features = np.array([extract_features(message)])
    numeric_scaled   = scaler.transform(numeric_features)

    final_input = sp.hstack([
        text_features,
        sp.csr_matrix(numeric_scaled)
    ])

    prediction = str(model.predict(final_input)[0])
    is_attack  = prediction.lower() in ["anomalous", "attack", "malicious", "1"]

    if is_attack:
        result     = "⚠️ Suspicious Attack Detected"
        risk       = "High Risk"
        confidence = 0.75
    else:
        attack_type = "Normal Request"
        confidence  = 0.95
        result      = "✅ Normal Safe Request"
        risk        = "Low Risk"

    return {
        "prediction":  prediction,
        "result":      result,
        "risk":        risk,
        "attack_type": attack_type,
        "confidence":  confidence
    }