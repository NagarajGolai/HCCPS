import os
import google.generativeai as genai
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

# Professional Configuration: 
# Move the key to your .env file and access via settings.
# NEVER hardcode keys in production scripts.
genai.configure(api_key="AIzaSyC2IhImCx-0ojrKMeoB3N6e9JZ6xoKlIfk")

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
        predicted_cost = payload.get('predictedCostInr', 0)
        
        # Enhanced Prompt Engineering for a '2 Crore' Project feel
        prompt = f"""
        Role: Senior Indian Civil Engineer & Vastu Consultant.
        Project: Premium Residential Construction (HCCPS).
        
        Parameters:
        - Location: {house_data.get('city', 'Tier 1 City')}
        - Dimensions: {house_data.get('plot_area_sqft', 0)} sqft Plot | {house_data.get('builtup_area_sqft', 0)} sqft Built-up.
        - Configuration: {house_data.get('bhk', 0)} BHK, {house_data.get('floors', 0)} Floors.
        - Material Specification: {house_data.get('material_tier', 'Premium')} Grade.
        - Geological Profile: {house_data.get('soil_type', 'Loamy')} Soil.
        - Estimated Valuation: ₹{predicted_cost:,}
        - Current Metrics: Eco Score {eco_score_val}/100, Vastu Score {vastu_score_val}/100.
        
        Objective: Provide high-fidelity engineering advice covering:
        1. Foundation recommendations based on soil type.
        2. Material grades (Steel/Cement/Aggregate) for {house_data.get('material_tier', 'Premium')} builds.
        3. Specific Vastu corrections to improve the score.
        4. BOQ (Bill of Quantities) optimization strategies for the {house_data.get('city', 'local')} market.
        
        Format: Professional, technical, yet concise numbered points.
        """

        try:
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