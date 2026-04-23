from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from model import predict_threat
import random
import csv
import os

app = FastAPI()

# ✅ CORS (for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Input schema
class InputData(BaseModel):
    features: list

# ✅ Home route
@app.get("/")
def home():
    return {"message": "CyberSIEM Backend Running"}

# ✅ ML Prediction + SAVE TO CSV
@app.post("/predict")
def predict(data: InputData):
    result = predict_threat(data.features)

    # create file if not exists
    file_path = "backend/reports.csv"
    file_exists = os.path.isfile(file_path)

    with open(file_path, "a", newline="") as file:
        writer = csv.writer(file)

        # optional header
        if not file_exists:
            writer.writerow(["status", "severity"])

        writer.writerow([result["status"], result["severity"]])

    return result

# ✅ Dashboard (random metrics)
@app.get("/dashboard")
def dashboard():
    return {
        "total_traffic": random.randint(1000000, 2000000),
        "threats": random.randint(100, 300),
        "anomaly_score": round(random.uniform(0.3, 0.9), 2),
        "alerts": random.randint(1, 20),
        "blocked": random.randint(1000, 3000),
        "accuracy": random.randint(90, 98)
    }

# ✅ Reports API (READ CSV)
@app.get("/reports")
def get_reports():
    reports = []

    try:
        with open("backend/reports.csv", "r") as file:
            reader = csv.reader(file)
            next(reader, None)  # skip header

            for row in reader:
                if len(row) >= 2:
                    reports.append({
                        "status": row[0],
                        "severity": row[1]
                    })

    except FileNotFoundError:
        return []

    return reports