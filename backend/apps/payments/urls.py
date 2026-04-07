from django.urls import path

from .views import (
    CreateRazorpayOrderView,
    RazorpayWebhookView,
    SubscriptionStatusView,
    VerifyRazorpayPaymentView,
)

urlpatterns = [
    path("subscription-status/", SubscriptionStatusView.as_view(), name="subscription-status"),
    path("create-order/", CreateRazorpayOrderView.as_view(), name="create-order"),
    path("verify-payment/", VerifyRazorpayPaymentView.as_view(), name="verify-payment"),
    path("webhook/", RazorpayWebhookView.as_view(), name="razorpay-webhook"),
]
