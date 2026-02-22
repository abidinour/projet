# ================================
# Web Attack Detection - CSIC 2010
# Models: Logistic Regression, Linear SVM, Random Forest
# Train: 80% | Test: 20%
# ================================

import zipfile
import pandas as pd
import numpy as np
import scipy.sparse as sp

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from sklearn.preprocessing import MinMaxScaler


# ================================
# 1. Load Dataset
# ================================

zip_path = "csic_database.csv.zip"

with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    csv_filename = [f for f in zip_ref.namelist() if f.endswith('.csv')][0]
    with zip_ref.open(csv_filename) as csv_file:
        df = pd.read_csv(csv_file)

print("Dataset shape:", df.shape)
print(df.columns.tolist())
print(df["classification"].value_counts())
print(df.head())


# ================================
# 2. Feature Engineering
# ================================

def extract_features(df):
    url     = df["URL"].fillna("")
    content = df["content"].fillna("")

    df["url_length"]     = url.apply(len)
    df["content_length"] = content.apply(len)

    df["special_chars"] = url.apply(
        lambda x: sum(c in "!@#$%^&*()=+[]{}|;:',.<>?/\\" for c in x)
    )

    df["has_sqli"] = url.str.contains(
        "select|union|insert|drop|delete|update|exec|cast|convert|char|declare",
        case=False, regex=True
    ).astype(int)

    df["has_xss"] = url.str.contains(
        "<script|onerror|alert|javascript:|onload|onclick|eval\\(",
        case=False, regex=True
    ).astype(int)

    df["has_traversal"] = url.str.contains(
        "\\.\\./|etc/passwd|/proc/", case=False, regex=True
    ).astype(int)

    df["num_params"] = url.apply(lambda x: x.count("&") + 1 if "?" in x else 0)

    return df

df = extract_features(df)

print("\nFeatures added:")
print(df[["url_length", "content_length", "special_chars",
          "has_sqli", "has_xss", "has_traversal", "num_params"]].head())


# ================================
# 3. Prepare Features
# ================================

df["text"] = df["URL"].fillna("") + " " + df["content"].fillna("")

numerical_cols = ["url_length", "content_length", "special_chars",
                  "has_sqli", "has_xss", "has_traversal", "num_params"]

X_text = df["text"]
X_num  = df[numerical_cols].values
y      = df["classification"]


# ================================
# 4. Train / Test Split (80/20)
# ================================

X_text_train, X_text_test, X_num_train, X_num_test, y_train, y_test = train_test_split(
    X_text, X_num, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(y_train))
print("Testing samples :", len(y_test))


# ================================
# 5. Feature Extraction (TF-IDF)
# ================================

vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    lowercase=True
)

X_text_train_vec = vectorizer.fit_transform(X_text_train)
X_text_test_vec  = vectorizer.transform(X_text_test)


# ================================
# 6. Scale Numerical Features
# ================================

scaler = MinMaxScaler()
X_num_train_scaled = scaler.fit_transform(X_num_train)
X_num_test_scaled  = scaler.transform(X_num_test)


# ================================
# 7. Combine TF-IDF + Numerical
# ================================

X_train_final = sp.hstack([X_text_train_vec, sp.csr_matrix(X_num_train_scaled)])
X_test_final  = sp.hstack([X_text_test_vec,  sp.csr_matrix(X_num_test_scaled)])


# ================================
# 8. Models Definition
# ================================

models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, class_weight='balanced'),
    "Linear SVM"         : LinearSVC(class_weight='balanced'),
    "Random Forest"      : RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
}


# ================================
# 9. Training & Evaluation
# ================================

for name, model in models.items():
    print("\n==============================")
    print("Model:", name)
    print("==============================")

    model.fit(X_train_final, y_train)
    y_pred = model.predict(X_test_final)

    accuracy  = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall    = recall_score(y_test, y_pred)
    f1        = f1_score(y_test, y_pred)

    print("Accuracy :", round(accuracy,  4))
    print("Precision:", round(precision, 4))
    print("Recall   :", round(recall,    4))
    print("F1-Score :", round(f1,        4))

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
