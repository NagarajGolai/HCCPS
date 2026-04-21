from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CostPrediction, MaterialMarketIndex
from .serializers import (
    CostPredictionInputSerializer,
    CostPredictionResponseSerializer,
    MaterialMarketIndexSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
)
from .services import create_otp, predict_construction_cost, verify_otp
from .throttles import PredictionDailyUserThrottle

User = get_user_model()


def _get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class OTPRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        if payload["purpose"] == "signin" and not User.objects.filter(
            email=payload["email"]
        ).exists():
            return Response(
                {"detail": "User does not exist. Please sign up first."},
                status=status.HTTP_404_NOT_FOUND,
            )

        otp = create_otp(email=payload["email"], purpose=payload["purpose"])
        from django.core.mail import send_mail
        try:
            send_mail(
                "PropVerse AI OTP Code",
                f"Your OTP is {otp.code}. Valid for 5 minutes.",
                None,
                [payload["email"]],
                fail_silently=False,
            )
            dev_msg = "OTP sent via email + dev preview"
        except Exception as e:
            dev_msg = f"Email failed ({str(e)}), using dev preview"
        return Response(
            {
                "detail": dev_msg,
                "otp_preview_for_dev": otp.code,
            },
            status=status.HTTP_200_OK,
        )


class OTPVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        otp = verify_otp(
            email=payload["email"],
            purpose=payload["purpose"],
            code=payload["code"],
        )
        if not otp:
            return Response(
                {"detail": "Invalid or expired OTP."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user, created = User.objects.get_or_create(
            username=payload["email"],
            defaults={
                "email": payload["email"],
                "first_name": payload.get("full_name", "").strip(),
            },
        )
        if not created and payload.get("full_name"):
            user.first_name = payload["full_name"].strip()
            user.save(update_fields=["first_name"])

        token_data = _get_tokens_for_user(user)
        return Response(
            {
                "detail": "OTP verification successful.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.first_name,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                },
                "tokens": token_data,
            },
            status=status.HTTP_200_OK,
        )


class PredictCostView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [PredictionDailyUserThrottle]

    def post(self, request):
        serializer = CostPredictionInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        predicted_cost = predict_construction_cost(payload)

        prediction = CostPrediction.objects.create(
            user=request.user,
            city=payload["city"],
            plot_area_sqft=payload["plot_area_sqft"],
            builtup_area_sqft=payload["builtup_area_sqft"],
            floors=payload["floors"],
            bhk=payload["bhk"],
            material_tier=payload["material_tier"],
            soil_type=payload["soil_type"],
            predicted_cost_inr=predicted_cost,
            model_version="rf_v1",
        )

        return Response(
            CostPredictionResponseSerializer(prediction).data,
            status=status.HTTP_200_OK,
        )


class PredictionHistoryView(generics.ListAPIView):
    serializer_class = CostPredictionResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CostPrediction.objects.filter(user=self.request.user)


class MaterialMarketIndexListView(generics.ListAPIView):
    serializer_class = MaterialMarketIndexSerializer
    permission_classes = [permissions.AllowAny]
    queryset = MaterialMarketIndex.objects.all().order_by("city", "material")


from rest_framework import viewsets
from .serializers import FloorPlanSerializer
from .models import FloorPlan
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class FloorPlanViewSet(viewsets.ModelViewSet):
    serializer_class = FloorPlanSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return FloorPlan.objects.filter(user=self.request.user)
        return FloorPlan.objects.filter(is_public=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

