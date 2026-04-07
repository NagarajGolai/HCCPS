from django.utils import timezone
from rest_framework import authentication, exceptions

from .models import APIKey, hash_api_key


class B2BAPIKeyAuthentication(authentication.BaseAuthentication):
    keyword = "X-API-Key"

    def authenticate(self, request):
        raw_key = request.headers.get(self.keyword, "").strip()
        if not raw_key:
            return None

        hashed = hash_api_key(raw_key)
        api_key = APIKey.objects.select_related("user").filter(key_hash=hashed, is_active=True).first()
        if not api_key:
            raise exceptions.AuthenticationFailed("Invalid API key.")

        month_token = timezone.now().strftime("%Y-%m")
        if api_key.current_month != month_token:
            api_key.current_month = month_token
            api_key.requests_made = 0

        if api_key.requests_made >= api_key.monthly_limit:
            raise exceptions.Throttled(detail="Monthly API key request limit reached.")

        api_key.requests_made += 1
        api_key.last_used_at = timezone.now()
        api_key.save(update_fields=["current_month", "requests_made", "last_used_at", "updated_at"])
        request.b2b_api_key = api_key
        return api_key.user, None
