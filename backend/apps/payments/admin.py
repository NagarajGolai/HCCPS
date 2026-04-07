from django.contrib import admin

from .models import RazorpayOrder, UserSubscription

admin.site.register(UserSubscription)
admin.site.register(RazorpayOrder)
