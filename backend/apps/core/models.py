from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

User = get_user_model()


class OTPCode(models.Model):
    PURPOSE_CHOICES = (
        ("signup", "Signup"),
        ("signin", "Signin"),
    )

    email = models.EmailField(db_index=True)
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["email", "purpose", "created_at"])]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.email} [{self.purpose}]"

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at


class CostPrediction(models.Model):
    MATERIAL_CHOICES = (
        ("Standard", "Standard"),
        ("Premium", "Premium"),
        ("Luxury", "Luxury"),
    )

    SOIL_CHOICES = (
        ("Hard Rock", "Hard Rock"),
        ("Sandy", "Sandy"),
        ("Clay", "Clay"),
        ("Black Cotton", "Black Cotton"),
        ("Loamy", "Loamy"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="predictions")
    city = models.CharField(max_length=100)
    plot_area_sqft = models.FloatField()
    builtup_area_sqft = models.FloatField()
    floors = models.PositiveIntegerField()
    bhk = models.PositiveIntegerField()
    material_tier = models.CharField(max_length=20, choices=MATERIAL_CHOICES)
    soil_type = models.CharField(max_length=40, choices=SOIL_CHOICES)
    predicted_cost_inr = models.FloatField()
    model_version = models.CharField(max_length=50, default="rf_v1")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.city} - INR {self.predicted_cost_inr:,.0f}"


class MaterialMarketIndex(models.Model):
    MATERIAL_CHOICES = (
        ("Cement", "Cement"),
        ("Steel", "Steel"),
        ("Sand", "Sand"),
    )

    city = models.CharField(max_length=100)
    material = models.CharField(max_length=30, choices=MATERIAL_CHOICES)
    price_per_unit = models.FloatField()
    unit = models.CharField(max_length=20, default="per unit")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("city", "material")
        indexes = [models.Index(fields=["city", "material"])]

    def __str__(self) -> str:
        return f"{self.city} {self.material}: {self.price_per_unit}"


class CityEconomicMultiplier(models.Model):
    city = models.CharField(max_length=100, unique=True)
    base_multiplier = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["city"]

    def __str__(self) -> str:
        return f"{self.city}: {self.base_multiplier}"
