from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import scipy.sparse as sp
import os

app = FastAPI()

# =========================
# Load models
# =========================

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

print("Loading models...")

model = joblib.load(os.path.join(MODELS_DIR, "best_model.pkl"))
vectorizer = joblib.load(os.path.join(MODELS_DIR, "vectorizer.pkl"))
scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))

print("Models loaded successfully.")

# =========================
# Request format
# =========================

class RequestData(BaseModel):
    url: str
    content: str = ""


# =========================
# Feature extraction
# =========================

def extract_features(url, content):

    return [
        len(url),
        len(content),
        sum(c in "!@#$%^&*()=+[]{}|;:',.<>?/\\"
            for c in url),
        int(any(x in url.lower() for x in ["select","union","insert","drop","delete","update"])),
        int(any(x in url.lower() for x in ["<script","alert","javascript"])),
        url.count("&")
    ]


# =========================
# Test route
# =========================

@app.get("/")
def home():
    return {"message": "AI API running"}


# =========================
# Prediction
# =========================

@app.post("/predict")
def predict(data: RequestData):

    try:

        text = data.url + " " + data.content

        text_vec = vectorizer.transform([text])

        num_features = extract_features(data.url, data.content)

        num_scaled = scaler.transform([num_features])

        X = sp.hstack([text_vec, sp.csr_matrix(num_scaled)])

        pred = model.predict(X)[0]

        # IMPORTANT: labels reversed
        prediction = "attack" if pred == 0 else "normal"

        return {
            "url": data.url,
            "prediction": prediction
        }

    except Exception as e:

        return {
            "error": str(e)
        }