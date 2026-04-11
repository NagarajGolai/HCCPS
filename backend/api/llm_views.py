import json

import google.generativeai as genai
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

        if not settings.GEMINI_API_KEY:
            return Response({"detail": "LLM provider (Gemini) is not configured. Add GEMINI_API_KEY to .env."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            system_prompt = (
                "You are a licensed structural engineer and Indian construction architect. "
                "You must provide practical, safety-aware recommendations based strictly on the JSON context provided. "
                "Never invent missing values. If data is missing, state exactly what is missing. "
                "Output concise actionable guidance in bullet points under sections: Structural Notes, Cost Optimization, "
                "Eco and Vastu Alignment, and Next Engineering Step."
            )
            user_prompt = json.dumps({
                "context_type": "floor_plan_and_cost_context",
                "house_data": house_data,
                "eco_score": eco_score,
                "vastu_score": vastu_score,
                "predicted_cost_inr": predicted_cost,
            })

            response = model.generate_content([system_prompt, user_prompt])
            advice = response.text.strip() or "No guidance returned."
            return Response({"advice": advice})
        except Exception as e:
            return Response(
                {"detail": f"Failed to fetch architect guidance from Gemini: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )
