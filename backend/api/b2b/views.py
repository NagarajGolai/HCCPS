from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.models import CityEconomicMultiplier, MaterialMarketIndex
from apps.core.services import predict_construction_cost

from .authentication import B2BAPIKeyAuthentication
from .models import APIKey
from .serializers import APIKeyCreateSerializer, APIKeyListSerializer, B2BPredictionRequestSerializer


class APIKeyListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        keys = APIKey.objects.filter(user=request.user).order_by("-created_at")
        payload = [
            {
                "id": key.id,
                "name": key.name,
                "key_prefix": key.key_prefix,
                "requests_made": key.requests_made,
                "monthly_limit": key.monthly_limit,
                "is_active": key.is_active,
                "last_used_at": key.last_used_at,
                "created_at": key.created_at,
            }
            for key in keys
        ]
        serializer = APIKeyListSerializer(payload, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = APIKeyCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        api_key, raw_key = APIKey.create_key(
            user=request.user,
            name=data.get("name", ""),
            monthly_limit=data.get("monthly_limit", 10000),
        )
        return Response(
            {
                "detail": "API key generated successfully.",
                "api_key": raw_key,
                "key_id": api_key.id,
                "key_prefix": api_key.key_prefix,
                "monthly_limit": api_key.monthly_limit,
            },
            status=status.HTTP_201_CREATED,
        )


class APIKeyRevokeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, key_id: int):
        api_key = APIKey.objects.filter(id=key_id, user=request.user, is_active=True).first()
        if not api_key:
            return Response({"detail": "Active key not found."}, status=status.HTTP_404_NOT_FOUND)
        api_key.is_active = False
        api_key.revoked_at = timezone.now()
        api_key.save(update_fields=["is_active", "revoked_at", "updated_at"])
        return Response({"detail": "API key revoked successfully."})


class B2BPredictionView(generics.GenericAPIView):
    authentication_classes = [B2BAPIKeyAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = B2BPredictionRequestSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data
        predicted_cost = predict_construction_cost(payload)
        key = getattr(request, "b2b_api_key", None)
        return Response(
            {
                "city": payload["city"],
                "predicted_cost_inr": predicted_cost,
                "input": payload,
                "usage": {
                    "requests_made": key.requests_made if key else None,
                    "monthly_limit": key.monthly_limit if key else None,
                },
            }
        )


class B2BCityEconomicsView(APIView):
    authentication_classes = [B2BAPIKeyAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        multipliers = list(
            CityEconomicMultiplier.objects.values("city", "base_multiplier").order_by("city")
        )
        materials = list(
            MaterialMarketIndex.objects.values("city", "material", "price_per_unit", "unit").order_by(
                "city", "material"
            )
        )
        return Response({"city_multipliers": multipliers, "market_materials": materials})
