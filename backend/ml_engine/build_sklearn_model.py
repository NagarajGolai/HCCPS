"""
Train cost_predictor.joblib using scikit-learn only (no XGBoost).
Use when XGBoost/OpenMP is unavailable; matches the 7-column pipeline in train_model.py.
"""
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

SEED = 42
FEATURE_COLS = [
    "city",
    "plot_area_sqft",
    "builtup_area_sqft",
    "floors",
    "bhk",
    "material_tier",
    "soil_type",
]


def main() -> None:
    artifacts_dir = Path(__file__).resolve().parent / "artifacts"
    csv_path = artifacts_dir / "synthetic_training_data.csv"
    if not csv_path.exists():
        raise SystemExit(f"Missing dataset: {csv_path}")

    df = pd.read_csv(csv_path)
    X = df[FEATURE_COLS]
    y = df["estimated_cost_inr"]

    categorical_cols = ["city", "material_tier", "soil_type"]
    numeric_cols = ["plot_area_sqft", "builtup_area_sqft", "floors", "bhk"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
            ("num", StandardScaler(), numeric_cols),
        ]
    )

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=24,
        min_samples_leaf=2,
        random_state=SEED,
        n_jobs=-1,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=SEED)
    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)
    rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
    r2 = float(r2_score(y_test, preds))
    print(f"RMSE (INR): {rmse:,.2f}  R2: {r2:.4f}")

    out = artifacts_dir / "cost_predictor.joblib"
    joblib.dump(pipeline, out)
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
