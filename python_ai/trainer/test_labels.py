import pandas as pd

data = pd.read_csv("../database/csic_database.csv")

print(data["classification"].value_counts())