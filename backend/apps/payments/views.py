import hashlib
import hmac
import json
from datetime import timedelta

import razorpay
from django.conf import settings
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import RazorpayOrder, UserSubscription
from .serializers import CreateOrderSerializer, VerifyPaymentSerializer


def _rzp_client():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        return None
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


def _activate_pro(user):
    sub, _ = UserSubscription.objects.get_or_create(user=user)
    now = timezone.now()
    current_expiry = sub.expires_at if sub.expires_at and sub.expires_at > now else now
    sub.plan = "pro"
    sub.is_active = True
    sub.starts_at = now
    sub.expires_at = current_expiry + timedelta(days=30)
    sub.save()
    return sub


class SubscriptionStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sub = getattr(request.user, "active_subscription", None)
        if not sub:
            return Response({"plan": "free", "is_active": False, "expires_at": None})
        return Response({"plan": sub.plan, "is_active": sub.is_active, "expires_at": sub.expires_at})


class CreateRazorpayOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        client = _rzp_client()
        if client is None:
            return Response(
                {"detail": "Payments not configured. Missing Razorpay credentials."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        amount = settings.RAZORPAY_PRO_PLAN_AMOUNT_PAISE
        order = client.order.create(
            {
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1,
                "notes": {"user_id": str(request.user.id), "plan": payload["plan"]},
            }
        )
        RazorpayOrder.objects.create(
            user=request.user,
            razorpay_order_id=order["id"],
            amount_paise=amount,
            currency=order["currency"],
            status="created",
            payload=order,
        )
        return Response(
            {
                "order_id": order["id"],
                "amount_paise": amount,
                "currency": order["currency"],
                "key_id": settings.RAZORPAY_KEY_ID,
            }
        )


class VerifyRazorpayPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
            f'{payload["razorpay_order_id"]}|{payload["razorpay_payment_id"]}'.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(expected, payload["razorpay_signature"]):
            return Response({"detail": "Signature verification failed."}, status=status.HTTP_400_BAD_REQUEST)

        order = RazorpayOrder.objects.filter(
            razorpay_order_id=payload["razorpay_order_id"], user=request.user
        ).first()
        if not order:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        order.status = "paid"
        order.razorpay_payment_id = payload["razorpay_payment_id"]
        order.payload = {**order.payload, "signature_verified": True}
        order.save(update_fields=["status", "razorpay_payment_id", "payload", "updated_at"])
        sub = _activate_pro(request.user)
        return Response({"detail": "Payment verified. Pro subscription activated.", "plan": sub.plan})


class RazorpayWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        secret = settings.RAZORPAY_WEBHOOK_SECRET
        signature = request.headers.get("X-Razorpay-Signature", "")
        body = request.body

        expected = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest() if secret else ""
        if not secret or not hmac.compare_digest(expected, signature):
            return Response({"detail": "Invalid webhook signature."}, status=status.HTTP_400_BAD_REQUEST)

        event = json.loads(body.decode("utf-8"))
        if event.get("event") == "payment.captured":
            entity = event.get("payload", {}).get("payment", {}).get("entity", {})
            order_id = entity.get("order_id")
            payment_id = entity.get("id", "")
            order = RazorpayOrder.objects.filter(razorpay_order_id=order_id).select_related("user").first()
            if order:
                order.status = "paid"
                order.razorpay_payment_id = payment_id
                order.payload = event
                order.save(update_fields=["status", "razorpay_payment_id", "payload", "updated_at"])
                _activate_pro(order.user)
        return Response({"status": "ok"})
