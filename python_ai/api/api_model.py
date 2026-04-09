from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import scipy.sparse as sp
import os

from attack_detector import detect_attack_type

app = FastAPI()

# ===============================
# Load Models
# ===============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

model = joblib.load(os.path.join(MODELS_DIR, "best_model.pkl"))
vectorizer = joblib.load(os.path.join(MODELS_DIR, "vectorizer.pkl"))
scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))

# ===============================
# Request Model
# ===============================
class RequestData(BaseModel):
    url: str
    content: str = ""

# ===============================
# Feature Extraction
# ===============================
def extract_features(url, content):
    url = str(url)
    content = str(content)

    return [
        len(url),
        len(content),
        url.count("&"),
        url.count("="),
        url.count("?"),
        sum(c.isdigit() for c in url),
        sum(c in "!@#$%^&*()" for c in url),
        int("../" in url or "..\\" in url),
        int("<script" in url.lower()),
        int("select" in url.lower()),
        int("union" in url.lower()),
        int("drop" in url.lower())
    ]

@app.get("/")
def home():
    return {"message": "AI Security API running"}

# ===============================
# Prediction
# ===============================
@app.post("/predict")
def predict(data: RequestData):
    try:
        attack_type = detect_attack_type(data.url, data.content)

        # Rule-based
        if attack_type != "unknown_attack":
            return {
                "url": data.url,
                "prediction": "attack",
                "attack_type": attack_type,
                "confidence": 0.95
            }

        # ML
        text = data.url + " " + data.content
        text_vec = vectorizer.transform([text])

        num = extract_features(data.url, data.content)
        num_scaled = scaler.transform([num])

        X = sp.hstack([text_vec, sp.csr_matrix(num_scaled)])

        pred = model.predict(X)[0]

        try:
            decision = model.decision_function(X)[0]
            confidence = min(abs(decision), 1.0)
        except:
            confidence = 0.5

        if pred == 1 and confidence > 0.8:
            return {
                "url": data.url,
                "prediction": "attack",
                "attack_type": "unknown_attack",
                "confidence": confidence
            }

        return {
            "url": data.url,
            "prediction": "normal",
            "attack_type": "none",
            "confidence": confidence
        }

    except Exception as e:
        return {
            "url": data.url,
            "prediction": "normal",
            "attack_type": "none",
            "confidence": 0.0,
            "error": str(e)
        }