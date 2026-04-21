
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import json

class HouseDesign(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, default='Untitled Floor Plan')
    data = models.JSONField()  # {elements: [...], meta: {area, bhk...}}
    area_sqft = models.FloatField(default=0)
    bhk = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class FloorPlan(models.Model):
    """
    Dedicated floor plan storage for CAD editor
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='floor_plans')
    title = models.CharField(max_length=255)
    json_data = models.JSONField()  # Konva elements export
    total_area_sqft = models.FloatField()
    bhk_count = models.IntegerField()
    floors = models.IntegerField(default=1)
    plot_area_sqft = models.FloatField(null=True, blank=True)
    thumbnail = models.TextField(blank=True)  # SVG preview
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    version = models.CharField(max_length=20, default='1.0')
    is_public = models.BooleanField(default=False)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} by {self.user.username if self.user else 'Anonymous'} ({self.total_area_sqft} sqft)"

    def get_preview_svg(self):
        # Generate SVG from json_data for list view
        return ''  # Impl later

class CityEconomicMultiplier(models.Model):
    city = models.CharField(max_length=100, unique=True)
    base_multiplier = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['city']

    def __str__(self):
        return f"{self.city}: {self.base_multiplier:.2f}x"

class CostPrediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='predictions')
    city = models.CharField(max_length=100)
    plot_area_sqft = models.FloatField()
    builtup_area_sqft = models.FloatField()
    floors = models.PositiveIntegerField()
    bhk = models.PositiveIntegerField()
    material_tier = models.CharField(
        max_length=20, 
        choices=[
            ('Standard', 'Standard'), 
            ('Premium', 'Premium'), 
            ('Luxury', 'Luxury')
        ]
    )
    soil_type = models.CharField(
        max_length=40, 
        choices=[
            ('Hard Rock', 'Hard Rock'), 
            ('Sandy', 'Sandy'), 
            ('Clay', 'Clay'), 
            ('Black Cotton', 'Black Cotton'), 
            ('Loamy', 'Loamy')
        ]
    )
    predicted_cost_inr = models.FloatField()
    model_version = models.CharField(max_length=50, default='rf_v1')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"₹{self.predicted_cost_inr:,.0f} - {self.city} ({self.bhk}BHK)"

class MaterialMarketIndex(models.Model):
    city = models.CharField(max_length=100)
    material = models.CharField(
        max_length=30, 
        choices=[
            ('Cement', 'Cement'), 
            ('Steel', 'Steel'), 
            ('Sand', 'Sand')
        ]
    )
    price_per_unit = models.FloatField()
    unit = models.CharField(max_length=20, default='per unit')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('city', 'material')
        indexes = [models.Index(fields=['city', 'material'])]
        ordering = ['city', 'material']

    def __str__(self):
        return f"{self.material}/{self.city}: ₹{self.price_per_unit} {self.unit}"

class OTPCode(models.Model):
    email = models.EmailField(db_index=True, max_length=254)
    code = models.CharField(max_length=6)
    purpose = models.CharField(
        max_length=20, 
        choices=[
            ('signup', 'Signup'), 
            ('signin', 'Signin')
        ]
    )
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['email', 'purpose', 'created_at'])]

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"OTP for {self.email} ({self.purpose})"
