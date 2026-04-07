import json

import requests
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class AIArchitectAdviceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        payload = request.data
        house_data = payload.get("house_data", {})
        eco_score = payload.get("eco_score")
        vastu_score = payload.get("vastu_score")
        predicted_cost = payload.get("predicted_cost_inr")

        if not settings.OPENAI_API_KEY:
            return Response({"detail": "LLM provider is not configured."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        system_prompt = (
            "You are a licensed structural engineer and Indian construction architect. "
            "You must provide practical, safety-aware recommendations based strictly on the JSON context provided. "
            "Never invent missing values. If data is missing, state exactly what is missing. "
            "Output concise actionable guidance in bullet points under sections: Structural Notes, Cost Optimization, "
            "Eco and Vastu Alignment, and Next Engineering Step."
        )
        user_prompt = {
            "context_type": "floor_plan_and_cost_context",
            "house_data": house_data,
            "eco_score": eco_score,
            "vastu_score": vastu_score,
            "predicted_cost_inr": predicted_cost,
        }

        response = requests.post(
            f"{settings.OPENAI_API_BASE_URL.rstrip('/')}/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.OPENAI_MODEL,
                "temperature": 0.2,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": json.dumps(user_prompt)},
                ],
            },
            timeout=35,
        )
        if response.status_code >= 400:
            return Response(
                {"detail": "Failed to fetch architect guidance from LLM provider."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        llm_data = response.json()
        advice = (
            llm_data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
            or "No guidance returned."
        )
        return Response({"advice": advice})
