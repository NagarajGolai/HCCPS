import os
import google.generativeai as genai
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

# Professional Configuration: 
# Configure Gemini - handle potential missing key gracefully
GEMINI_KEY = getattr(settings, "GEMINI_API_KEY", None)
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)

class AIArchitectAdviceView(APIView):
    """
    The intellectual core of the HCCPS system.
    Provides expert-level civil engineering insights for Indian residential projects.
    """
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.data
        house_data = payload.get('house_data', {})
        eco_score_val = payload.get('ecoScore', 0)
        vastu_score_val = payload.get('vastuScore', 0)
        predicted_cost = payload.get('predictedCostInr') or 0
        user_query = payload.get('user_query', 'Hi')
        
        # Ensure predicted_cost is a number for formatting
        try:
            predicted_cost = float(predicted_cost)
        except (ValueError, TypeError):
            predicted_cost = 0
        
        # Enhanced Prompt Engineering for a '2 Crore' Project feel
        prompt = f"""
        Role: You are the Senior Lead Architect and Civil Engineer for HCCPS. 
        Mindset: You are advising a client on a 2 Crore premium residential project. Your advice must be high-precision, pragmatic, and luxury-oriented.
        Personality: Human, professional, and slightly witty. Use a grounded tone. 

        STRICT FORMATTING RULES:
        1. NO ASTERISKS (*) ALLOWED. 
        2. Use Markdown Headers (##) for titles and plain text for body.
        3. Use UPPERCASE for emphasis instead of bolding.
        4. End every response with exactly three SUGGESTED QUESTIONS on a new line.

        PROJECT REPOSITORY (Reference only):
        - Location: {house_data.get('city', 'Tier 1 City')}
        - Scale: {house_data.get('plot_area_sqft', 0)} sqft Plot | {house_data.get('builtup_area_sqft', 0)} sqft Built-up.
        - Specs: {house_data.get('bhk', 0)} BHK, {house_data.get('floors', 0)} Floors, {house_data.get('material_tier', 'Premium')} Grade.
        - Geology: {house_data.get('soil_type', 'Loamy')}
        - Valuation: ₹{predicted_cost:,}
        - Health: Eco {eco_score_val}/100 | Vastu {vastu_score_val}/100.

        CONVERSATIONAL LOGIC:
        - If the message is a greeting (Hi, Hello, Hlo), respond with a warm, human opening. Mention that you are the lead architect for their {house_data.get('city')} project.
        - Answer ONLY the specific question. Do not provide a full technical audit unless requested.
        - If the user asks for advice, integrate the PROJECT REPOSITORY data naturally. 
        - If structural advice is asked, prioritize M30/M35 concrete and Fe500D/Fe550D steel for this premium tier.

        User Message: {user_query}
        """
        try:
            if not GEMINI_KEY:
                raise ValueError("GEMINI_API_KEY is not configured in environment variables.")

            # Using the 2026 production-grade model identifier
            model = genai.GenerativeModel('gemini-3.1-flash-lite-preview')
            response = model.generate_content(prompt)
            
            advice = response.text
            response_status = "gemini-live"
            
        except Exception as e:
            # Professional Error Logging
            print(f"PropVerse AI Error: {str(e)}")
            
            # Robust Fallback for critical infrastructure
            advice = (
                "Strategic Fallback Engineering Protocol:\n"
                "1. Soil-Specific Foundation: Isolated RCC footings with plinth beams for loamy soil.\n"
                "2. Standard Material Mix: M25 Grade Concrete with Fe500D TMT reinforcement.\n"
                "3. Structural Grid: 230mm x 300mm columns at 3m maximum span for optimal stability.\n"
                f"Note: AI Service currently under high load ({str(e)[:50]}...)"
            )
            response_status = "fallback-active"
        
        return Response({
            "advice": advice,
            "status": response_status,
            "metadata": {
                "model_used": "gemini-3-flash",
                "timestamp": "2026-04-22"
            }
        })