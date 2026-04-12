from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import CostPrediction, MaterialMarketIndex

User = get_user_model()


class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    full_name = serializers.CharField(max_length=120, required=False, allow_blank=True)
    purpose = serializers.ChoiceField(choices=["signup", "signin"])


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.RegexField(regex=r"^\d{6}$")
    purpose = serializers.ChoiceField(choices=["signup", "signin"])
    full_name = serializers.CharField(max_length=120, required=False, allow_blank=True)


class CostPredictionInputSerializer(serializers.Serializer):
    city = serializers.CharField(max_length=50)
    plot_area_sqft = serializers.FloatField(min_value=300, max_value=10000)
    builtup_area_sqft = serializers.FloatField(min_value=250, max_value=15000)
    floors = serializers.IntegerField(min_value=1, max_value=10)
    bhk = serializers.IntegerField(min_value=1, max_value=10)
    material_tier = serializers.ChoiceField(choices=["Standard", "Premium", "Luxury"])
    soil_type = serializers.ChoiceField(
        choices=["Hard Rock", "Sandy", "Clay", "Black Cotton", "Loamy"]
    )

    def validate(self, attrs):
        if attrs["builtup_area_sqft"] < attrs["plot_area_sqft"] * 0.45:
            raise serializers.ValidationError(
                "Built-up area cannot be unrealistically low for plot size."
            )
        return attrs


class CostPredictionResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostPrediction
        fields = [
            "id",
            "city",
            "plot_area_sqft",
            "builtup_area_sqft",
            "floors",
            "bhk",
            "material_tier",
            "soil_type",
            "predicted_cost_inr",
            "model_version",
            "created_at",
        ]


class MaterialMarketIndexSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialMarketIndex
        fields = ["city", "material", "price_per_unit", "unit", "updated_at"]
