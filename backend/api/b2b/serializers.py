from rest_framework import serializers

from apps.core.serializers import CostPredictionInputSerializer


class APIKeyCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=80, required=False, allow_blank=True)
    monthly_limit = serializers.IntegerField(min_value=100, max_value=100000, required=False, default=10000)


class APIKeyListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    key_prefix = serializers.CharField()
    requests_made = serializers.IntegerField()
    monthly_limit = serializers.IntegerField()
    is_active = serializers.BooleanField()
    last_used_at = serializers.DateTimeField(allow_null=True)
    created_at = serializers.DateTimeField()


class B2BPredictionRequestSerializer(CostPredictionInputSerializer):
    client_name = serializers.CharField(max_length=200, allow_blank=True)
    project_id = serializers.CharField(max_length=100, required=False, allow_blank=True)
    notes = serializers.CharField(max_length=1000, required=False, allow_blank=True, default="")
