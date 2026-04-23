import joblib

# load trained model
model = joblib.load("model.pkl")

def predict_threat(features):
    try:
        prediction = model.predict([features])[0]

        if prediction == 1:
            return {
                "status": "Attack Detected",
                "severity": "High"
            }
        else:
            return {
                "status": "Normal Traffic",
                "severity": "Low"
            }

    except Exception as e:
        return {"error": str(e)}