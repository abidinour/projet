import os
import pandas as pd

BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, "..", "database", "csic_database.csv")

print("📂 Absolute Path:")
print(os.path.abspath(DATASET_PATH))

print("\n📌 File exists?")
print(os.path.exists(DATASET_PATH))

print("\n🔐 Can read file?")

try:
    with open(DATASET_PATH, "r", encoding="latin-1") as f:
        print("✅ File opened successfully")
except Exception as e:
    print("❌ Error opening file:", e)

print("\n📊 Trying pandas read...")

try:
    df = pd.read_csv(DATASET_PATH, encoding="latin-1")
    print("✅ Pandas loaded dataset")
    print("Rows:", len(df))
    print("Columns:", df.columns.tolist())
except Exception as e:
    print("❌ Pandas error:", e)