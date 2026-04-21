from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
import json

class AIArchitectAdviceView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.data
        
        house_data = payload.get('house_data', {})
        plot = house_data.get('plot', 'unknown')
        house = house_data.get('house', 'unknown')
        
        advice = f"""ENGINEERING ADVICE - PropVerse AI

1. **Foundation:** RCC isolated footing for residential
2. **Columns:** 9"x12" @2.5m centers
3. **Beams/Slab:** M25 concrete, Fe500 steel
4. **Walls:** 4.5" light bricks non-loadbearing
5. **Plumbing:** CPVC concealed
6. **Electrical:** PVC conduits

Plot: {plot}
Design: {house}

Payload debug: {json.dumps(payload, indent=2)[:500]}

Status: LIVE ✓"""
        
        return Response({"advice": advice, "status": "production"})

