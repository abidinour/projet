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
# Feature Extraction
# ===============================

def extract_features(url, content):

    url = str(url)
    content = str(content)

    return [
        len(url),                         # URL length
        len(content),                     # Content length
        url.count("&"),                   # number of parameters
        url.count("="),
        url.count("?"),
        sum(c.isdigit() for c in url),    # digits in URL
        sum(c in "!@#$%^&*()" for c in url),  # suspicious chars
        int("../" in url or "..\\" in url),   # path traversal
        int("<script" in url.lower()),        # XSS
        int("select" in url.lower()),         # SQL injection
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

    # First: rule-based detection
    attack_type = detect_attack_type(data.url, data.content)

    if attack_type != "unknown_attack":

        return {
            "url": data.url,
            "prediction": "attack",
            "attack_type": attack_type,
            "confidence": 0.95
        }

    # ===============================
    # AI Detection
    # ===============================

    text = data.url + " " + data.content

    text_vec = vectorizer.transform([text])

    num = extract_features(data.url, data.content)

    num_scaled = scaler.transform([num])

    X = sp.hstack([text_vec, sp.csr_matrix(num_scaled)])

    pred = model.predict(X)[0]

    # Confidence from SVM
    decision = model.decision_function(X)[0]
    confidence = float(abs(decision))

    if pred == 1:

        return {
            "url": data.url,
            "prediction": "attack",
            "attack_type": "unknown_attack",
            "confidence": confidence
        }

    return {
        "url": data.url,
        "prediction": "normal",
        "confidence": confidence
    }