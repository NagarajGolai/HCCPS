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
    model = _load_model()
    frame = pd.DataFrame(
        [
            {
                "city": payload["city"],
                "plot_area_sqft": payload["plot_area_sqft"],
                "builtup_area_sqft": payload["builtup_area_sqft"],
                "floors": payload["floors"],
                "bhk": payload["bhk"],
                "material_tier": payload["material_tier"],
                "soil_type": payload["soil_type"],
            }
        ]
    )
    prediction = model.predict(frame)[0]
    return float(np.round(prediction, 2))
