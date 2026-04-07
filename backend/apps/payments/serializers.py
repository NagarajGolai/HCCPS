from rest_framework import serializers


class CreateOrderSerializer(serializers.Serializer):
    amount_paise = serializers.IntegerField(min_value=100)
    plan = serializers.ChoiceField(choices=["pro"])


class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField(max_length=100)
    razorpay_payment_id = serializers.CharField(max_length=100)
    razorpay_signature = serializers.CharField(max_length=200)
