from django.urls import path

from .views import (
    MaterialMarketIndexListView,
    OTPRequestView,
    OTPVerifyView,
    PredictCostView,
    PredictionHistoryView,
    FloorPlanViewSet,
)

urlpatterns = [
    path("auth/request-otp/", OTPRequestView.as_view(), name="request-otp"),
    path("auth/verify-otp/", OTPVerifyView.as_view(), name="verify-otp"),
    path("predict-cost/", PredictCostView.as_view(), name="predict-cost"),
    path("prediction-history/", PredictionHistoryView.as_view(), name="prediction-history"),
    path("market-index/", MaterialMarketIndexListView.as_view(), name="market-index"),
    path('floorplans/', FloorPlanViewSet.as_view({'get': 'list', 'post': 'create'}), name='floorplan-list-create'),
    path('floorplans/<pk>/', FloorPlanViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='floorplan-detail'),
]

