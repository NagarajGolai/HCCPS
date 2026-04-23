import secrets
from datetime import timedelta
from typing import Any, Dict

import joblib
import numpy as np
import pandas as pd
from django.conf import settings
from django.utils import timezone

from .models import OTPCode

_MODEL_CACHE = None


def generate_otp() -> str:
    return str(secrets.randbelow(900000) + 100000)


def create_otp(email: str, purpose: str) -> OTPCode:
    code = generate_otp()
    return OTPCode.objects.create(
        email=email,
        code=code,
        purpose=purpose,
        expires_at=timezone.now() + timedelta(minutes=5),
    )


def verify_otp(email: str, purpose: str, code: str) -> OTPCode | None:
    otp = (
        OTPCode.objects.filter(email=email, purpose=purpose, is_verified=False)
        .order_by("-created_at")
        .first()
    )
    if not otp or otp.is_expired or otp.code != code:
        return None
    otp.is_verified = True
    otp.save(update_fields=["is_verified"])
    return otp


def _load_model():
    global _MODEL_CACHE
    if _MODEL_CACHE is None:
        model_path = settings.MODEL_ARTIFACT_PATH
        _MODEL_CACHE = joblib.load(model_path)
    return _MODEL_CACHE


def predict_construction_cost(payload: Dict[str, Any]) -> float:
    try:
        model = _load_model()
        # Use .get with defaults to avoid KeyError if serializer validation was bypassed or slightly off
        frame = pd.DataFrame(
            [
                {
                    "city": payload.get("city", "Mumbai"),
                    "plot_area_sqft": float(payload.get("plot_area_sqft", 1000)),
                    "builtup_area_sqft": float(payload.get("builtup_area_sqft", 800)),
                    "floors": int(payload.get("floors", 1)),
                    "bhk": int(payload.get("bhk", 2)),
                    "material_tier": payload.get("material_tier", "Standard"),
                    "soil_type": payload.get("soil_type", "Loamy"),
                }
            ]
        )
        prediction = model.predict(frame)[0]
        return float(np.round(prediction, 2))
    except Exception as e:
        # Log error or raise a custom exception that can be handled by the view
        print(f"Prediction engine error: {str(e)}")
        raise RuntimeError(f"Prediction engine failed: {str(e)}")
