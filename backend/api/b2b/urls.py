from django.urls import path

from .views import APIKeyListCreateView, APIKeyRevokeView, B2BCityEconomicsView, B2BPredictionView

urlpatterns = [
    path("keys/", APIKeyListCreateView.as_view(), name="b2b-api-key-list-create"),
    path("keys/<int:key_id>/revoke/", APIKeyRevokeView.as_view(), name="b2b-api-key-revoke"),
    path("predict/", B2BPredictionView.as_view(), name="b2b-predict"),
    path("city-economics/", B2BCityEconomicsView.as_view(), name="b2b-city-economics"),
]
