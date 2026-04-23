from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from hyperopt import hp, fmin, tpe, Trials, STATUS_OK

SEED = 42
np.random.seed(SEED)

CITY_MULTIPLIERS = {
    "Mumbai": 1.52,
    "Delhi": 1.48,
    "Bengaluru": 1.45,
    "Hyderabad": 1.31,
    "Chennai": 1.29,
    "Pune": 1.27,
    "Kolkata": 1.18,
    "Ahmedabad": 1.16,
    "Noida": 1.23,
    "Gurugram": 1.35,
    "Jaipur": 1.08,
    "Lucknow": 1.05,
    "Chandigarh": 1.14,
    "Indore": 1.02,
    "Bhopal": 1.00,
    "Nagpur": 0.98,
    "Surat": 1.04,
    "Vadodara": 0.99,
    "Nashik": 0.97,
    "Kochi": 1.11,
    "Thiruvananthapuram": 1.07,
    "Coimbatore": 1.03,
    "Visakhapatnam": 1.01,
    "Vijayawada": 0.96,
    "Bhubaneswar": 0.95,
    "Patna": 0.92,
    "Ranchi": 0.89,
    "Raipur": 0.91,
    "Mysuru": 0.94,
    "Mangalore": 1.06,
}

MATERIAL_MULTIPLIER = {"Standard": 1.00, "Premium": 1.24, "Luxury": 1.62}
SOIL_MULTIPLIER = {
    "Hard Rock": 0.95,
    "Sandy": 1.02,
    "Clay": 1.08,
    "Black Cotton": 1.18,
    "Loamy": 1.00,
}
GREEN_CERT_MULTIPLIER = {"No": 1.00, "Silver": 1.05, "Gold": 1.12}


def generate_dataset(n_samples: int = 20000) -> pd.DataFrame:
    cities = list(CITY_MULTIPLIERS.keys())
    materials = list(MATERIAL_MULTIPLIER.keys())
    soil_types = list(SOIL_MULTIPLIER.keys())
    green_certs = list(GREEN_CERT_MULTIPLIER.keys())

    records = []
    for _ in range(n_samples):
        city = np.random.choice(cities)
        inflation_year = np.random.randint(2020, 2026)
        plot_area = np.random.randint(600, 4201)
        floors = np.random.choice([1, 2, 3, 4], p=[0.28, 0.41, 0.23, 0.08])
        bhk = np.random.choice([1, 2, 3, 4, 5], p=[0.04, 0.27, 0.39, 0.22, 0.08])
        builtup_factor = np.random.uniform(0.72, 0.93) * (1 + (floors - 1) * 0.04)
        builtup_area = np.clip(plot_area * builtup_factor * floors, 500, 12000)
        material = np.random.choice(materials, p=[0.54, 0.33, 0.13])
        soil = np.random.choice(soil_types, p=[0.20, 0.23, 0.24, 0.11, 0.22])
        green_cert = np.random.choice(green_certs, p=[0.7, 0.2, 0.1])

        base_cost_psft = np.random.uniform(1650, 2350) * (1.02 ** (inflation_year - 2023))
        city_factor = CITY_MULTIPLIERS[city]
        material_factor = MATERIAL_MULTIPLIER[material]
        soil_factor = SOIL_MULTIPLIER[soil]
        green_factor = GREEN_CERT_MULTIPLIER[green_cert]
        floors_factor = 1 + (floors - 1) * 0.12
        complexity_factor = 1 + (bhk - 2) * 0.08

        raw_cost = (
            builtup_area
            * base_cost_psft
            * city_factor
            * material_factor
            * soil_factor
            * green_factor
            * floors_factor
            * complexity_factor
        )

        market_volatility = np.random.normal(loc=1.0, scale=0.045)
        logistics_noise = np.random.normal(loc=0.0, scale=160000)
        total_cost = max(raw_cost * market_volatility + logistics_noise, 900000)

        records.append(
            {
                "city": city,
                "inflation_year": int(inflation_year),
                "plot_area_sqft": float(plot_area),
                "builtup_area_sqft": float(round(builtup_area, 2)),
                "floors": int(floors),
                "bhk": int(bhk),
                "material_tier": material,
                "soil_type": soil,
                "green_cert": green_cert,
                "estimated_cost_inr": float(round(total_cost, 2)),
            }
        )

    return pd.DataFrame.from_records(records)


def train_and_serialize(df: pd.DataFrame) -> None:
    feature_cols = [
        "city",
        "plot_area_sqft",
        "builtup_area_sqft",
        "floors",
        "bhk",
        "material_tier",
        "soil_type",
    ]
    target_col = "estimated_cost_inr"

    X = df[feature_cols]
    y = df[target_col]

    categorical_cols = ["city", "material_tier", "soil_type"]
    numeric_cols = ["plot_area_sqft", "builtup_area_sqft", "floors", "bhk"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
            ("num", StandardScaler(), numeric_cols),
        ]
    )

    model = xgb.XGBRegressor(
        n_estimators=500,
        max_depth=10,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=SEED,
        n_jobs=-1,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED
    )
    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)

    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)

    print(f"Rows used for training: {len(df)}")
    print(f"RMSE (INR): {rmse:,.2f}")
    print(f"R2 Score: {r2:.4f}")

    artifacts_dir = Path(__file__).resolve().parent / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    model_path = artifacts_dir / "cost_predictor.joblib"
    dataset_path = artifacts_dir / "synthetic_training_data.csv"
    metadata_path = artifacts_dir / "model_metadata.joblib"

    joblib.dump(pipeline, model_path)
    df.to_csv(dataset_path, index=False)
    joblib.dump(
        {
            "rmse": rmse,
            "r2": r2,
            "cities": CITY_MULTIPLIERS,
            "material_multiplier": MATERIAL_MULTIPLIER,
            "soil_multiplier": SOIL_MULTIPLIER,
            "rows": len(df),
        },
        metadata_path,
    )
    print(f"Model saved at: {model_path}")
    print(f"Synthetic dataset saved at: {dataset_path}")


if __name__ == "__main__":
    data = generate_dataset(n_samples=25000)
    train_and_serialize(data)
