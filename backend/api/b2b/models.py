import secrets
from hashlib import sha256

from django.conf import settings
from django.db import models
from django.utils import timezone


def hash_api_key(raw_key: str) -> str:
    payload = f"{settings.API_KEY_PEPPER}:{raw_key}".encode("utf-8")
    return sha256(payload).hexdigest()


class APIKey(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="api_keys")
    name = models.CharField(max_length=80, default="Default Enterprise Key")
    key_prefix = models.CharField(max_length=16, db_index=True)
    key_hash = models.CharField(max_length=64, unique=True)
    requests_made = models.PositiveIntegerField(default=0)
    monthly_limit = models.PositiveIntegerField(default=10000)
    current_month = models.CharField(max_length=7, default="")
    is_active = models.BooleanField(default=True)
    revoked_at = models.DateTimeField(null=True, blank=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user.email}::{self.key_prefix}"

    @staticmethod
    def generate_raw_key() -> str:
        return f"pvk_{secrets.token_urlsafe(36)}"

    @classmethod
    def create_key(cls, user, name: str, monthly_limit: int = 10000):
        raw = cls.generate_raw_key()
        key_prefix = raw[:12]
        api_key = cls.objects.create(
            user=user,
            name=name or "Enterprise Key",
            key_prefix=key_prefix,
            key_hash=hash_api_key(raw),
            monthly_limit=monthly_limit,
            current_month=timezone.now().strftime("%Y-%m"),
        )
        return api_key, raw
