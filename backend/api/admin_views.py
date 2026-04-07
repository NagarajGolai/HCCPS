from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.models import CityEconomicMultiplier, CostPrediction
from apps.payments.models import RazorpayOrder

User = get_user_model()

DEFAULT_CITY_MULTIPLIERS = {
    "Mumbai": 1.52,
    "Delhi": 1.48,
    "Bengaluru": 1.45,
    "Hyderabad": 1.31,
    "Chennai": 1.29,
    "Pune": 1.27,
    "Kolkata": 1.18,
    "Ahmedabad": 1.16,
    "Noida": 1.23,
    "Gurugram": 1.35,
    "Jaipur": 1.08,
    "Lucknow": 1.05,
    "Chandigarh": 1.14,
    "Indore": 1.02,
    "Bhopal": 1.00,
    "Nagpur": 0.98,
    "Surat": 1.04,
    "Vadodara": 0.99,
    "Nashik": 0.97,
    "Kochi": 1.11,
    "Thiruvananthapuram": 1.07,
    "Coimbatore": 1.03,
    "Visakhapatnam": 1.01,
    "Vijayawada": 0.96,
    "Bhubaneswar": 0.95,
    "Patna": 0.92,
    "Ranchi": 0.89,
    "Raipur": 0.91,
    "Mysuru": 0.94,
    "Mangalore": 1.06,
}


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=13)

        predictions = (
            CostPrediction.objects.filter(created_at__date__gte=start_date)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        signups = (
            User.objects.filter(date_joined__date__gte=start_date)
            .annotate(day=TruncDate("date_joined"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        revenue_paise = (
            RazorpayOrder.objects.filter(status="paid").aggregate(total=Sum("amount_paise")).get("total") or 0
        )

        return Response(
            {
                "total_users": User.objects.count(),
                "total_predictions": CostPrediction.objects.count(),
                "total_revenue_inr": round(revenue_paise / 100, 2),
                "daily_predictions": [
                    {"day": row["day"].isoformat(), "count": row["count"]} for row in predictions
                ],
                "daily_signups": [{"day": row["day"].isoformat(), "count": row["count"]} for row in signups],
            }
        )


class AdminRevenueView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        orders = (
            RazorpayOrder.objects.filter(status="paid")
            .select_related("user")
            .order_by("-created_at")[:100]
        )
        data = [
            {
                "order_id": order.razorpay_order_id,
                "email": order.user.email,
                "amount_inr": round(order.amount_paise / 100, 2),
                "currency": order.currency,
                "created_at": order.created_at,
            }
            for order in orders
        ]
        return Response(data)


class AdminCityMultipliersView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        if not CityEconomicMultiplier.objects.exists():
            CityEconomicMultiplier.objects.bulk_create(
                [
                    CityEconomicMultiplier(city=city, base_multiplier=mult)
                    for city, mult in DEFAULT_CITY_MULTIPLIERS.items()
                ],
                ignore_conflicts=True,
            )
        rows = CityEconomicMultiplier.objects.all().values("id", "city", "base_multiplier", "updated_at")
        return Response(list(rows))

    def put(self, request):
        payload = request.data if isinstance(request.data, list) else []
        if not payload:
            return Response({"detail": "Payload must be a non-empty list."}, status=status.HTTP_400_BAD_REQUEST)

        updated = []
        for row in payload:
            city = str(row.get("city", "")).strip()
            multiplier = row.get("base_multiplier")
            if not city or multiplier is None:
                return Response(
                    {"detail": "Each row must include city and base_multiplier."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            obj, _ = CityEconomicMultiplier.objects.update_or_create(
                city=city, defaults={"base_multiplier": float(multiplier)}
            )
            updated.append({"city": obj.city, "base_multiplier": obj.base_multiplier})
        return Response({"detail": "City multipliers updated successfully.", "rows": updated})
