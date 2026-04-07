from rest_framework.throttling import UserRateThrottle


class PredictionDailyUserThrottle(UserRateThrottle):
    scope = "prediction_free"

    def get_cache_key(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return None
        active_subscription = getattr(request.user, "active_subscription", None)
        self.scope = "prediction_pro" if active_subscription and active_subscription.is_active else "prediction_free"
        return super().get_cache_key(request, view)
