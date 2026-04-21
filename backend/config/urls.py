from django.contrib import admin
from django.urls import include, path
from django.http import HttpResponseBadRequest

def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("apps.core.urls")),
    path("api/v1/payments/", include("apps.payments.urls")),
    path("api/v1/", include("api.urls")),
    path('sentry-debug/', trigger_error),
]
