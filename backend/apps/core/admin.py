from django.contrib import admin

from .models import CityEconomicMultiplier, CostPrediction, MaterialMarketIndex, OTPCode

admin.site.register(OTPCode)
admin.site.register(CostPrediction)
admin.site.register(MaterialMarketIndex)
admin.site.register(CityEconomicMultiplier)
