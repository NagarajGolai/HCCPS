from django.urls import include, path

from .admin_views import AdminCityMultipliersView, AdminRevenueView, AdminStatsView
from .llm_views import AIArchitectAdviceView

urlpatterns = [
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("admin/revenue/", AdminRevenueView.as_view(), name="admin-revenue"),
    path("admin/city-multipliers/", AdminCityMultipliersView.as_view(), name="admin-city-multipliers"),
    path("b2b/", include("api.b2b.urls")),
    path("llm/architect-advice/", AIArchitectAdviceView.as_view(), name="llm-architect-advice"),
]
