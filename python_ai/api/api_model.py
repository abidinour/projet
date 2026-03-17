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

BASE_DIR = os.path.dirname(__file__)
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
# Feature Extraction (IMPORTANT: same as training)
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

# ===============================
# Home Route
# ===============================

@app.get("/")
def home():
    return {"message": "AI Security API running"}

# ===============================
# Prediction Route
# ===============================

@app.post("/predict")
def predict(data: RequestData):

    try:
        # ===============================
        # 1) Rule-based detection (fast & accurate)
        # ===============================
        attack_type = detect_attack_type(data.url, data.content)

        if attack_type != "unknown_attack":
            return {
                "url": data.url,
                "prediction": "attack",
                "attack_type": attack_type,
                "confidence": 0.95
            }

        # ===============================
        # 2) AI Detection
        # ===============================
        text = data.url + " " + data.content

        text_vec = vectorizer.transform([text])

        num = extract_features(data.url, data.content)

        # Fix any mismatch safely
        num_scaled = scaler.transform([num])

        X = sp.hstack([text_vec, sp.csr_matrix(num_scaled)])

        pred = model.predict(X)[0]

        # ===============================
        # Confidence
        # ===============================
        try:
            decision = model.decision_function(X)[0]
            confidence = float(abs(decision))
        except:
            confidence = 0.5

        # ===============================
        # Smart Threshold (ANTI FALSE POSITIVE)
        # ===============================
        THRESHOLD = 0.8

        if pred == 1 and confidence > THRESHOLD:
            return {
                "url": data.url,
                "prediction": "attack",
                "attack_type": "unknown_attack",
                "confidence": confidence
            }

        # ===============================
        # Normal request
        # ===============================
        return {
            "url": data.url,
            "prediction": "normal",
            "attack_type": "none",
            "confidence": confidence
        }

    except Exception as e:

        # ===============================
        # Safety fallback (NO CRASH)
        # ===============================
        return {
            "url": data.url,
            "prediction": "normal",
            "attack_type": "none",
            "confidence": 0.0,
            "error": str(e)
        }