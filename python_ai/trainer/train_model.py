import pandas as pd
import numpy as np
import os
import joblib
import scipy.sparse as sp

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.svm import LinearSVC
from sklearn.metrics import classification_report

print("Loading dataset...")

BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, "..", "database", "csic_database.csv")
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

os.makedirs(MODELS_DIR, exist_ok=True)

data = pd.read_csv(DATASET_PATH)

data["URL"] = data["URL"].fillna("")
data["content"] = data["content"].fillna("")
data["text"] = data["URL"] + " " + data["content"]

y = data["classification"]

print("Dataset distribution:")
print(y.value_counts())


def extract_features(url, content):

    url = str(url)
    content = str(content)

    return [
        len(url),
        len(content),
        sum(c in "!@#$%^&*()=+[]{}|;:',.<>?/\\"
            for c in url),
        url.count("&"),
        url.count("="),
        url.count("?"),
        int(any(x in url.lower() for x in ["select","union","drop","delete","insert"])),
        int(any(x in url.lower() for x in ["<script","alert","javascript"])),
        int("../" in url or "..\\" in url)
    ]


num_features = data.apply(
    lambda row: extract_features(row["URL"], row["content"]),
    axis=1
)

X_num = np.array(num_features.tolist())

vectorizer = TfidfVectorizer(
    max_features=8000,
    ngram_range=(1,2),
    token_pattern=r"[^\s]+"
)

X_text = vectorizer.fit_transform(data["text"])

scaler = MinMaxScaler()

X_num_scaled = scaler.fit_transform(X_num)

X = sp.hstack([X_text, sp.csr_matrix(X_num_scaled)])

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Training model...")

model = LinearSVC(class_weight="balanced")

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

joblib.dump(model, os.path.join(MODELS_DIR, "best_model.pkl"))
joblib.dump(vectorizer, os.path.join(MODELS_DIR, "vectorizer.pkl"))
joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))

print("Model saved successfully")