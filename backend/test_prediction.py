import os
import sys
import django
import pandas as pd
import numpy as np

# Setup Django environment
sys.path.append(r'c:\Users\nagar\OneDrive\Desktop\hccp\HCCPS\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.core.services import predict_construction_cost

test_payloads = [
    {
        "city": "Mumbai",
        "plot_area_sqft": 1800,
        "builtup_area_sqft": 1450,
        "floors": 2,
        "bhk": 3,
        "material_tier": "Premium",
        "soil_type": "Loamy",
    },
    {
        "city": "Delhi",
        "plot_area_sqft": 1000,
        "builtup_area_sqft": 800,
        "floors": 1,
        "bhk": 2,
        "material_tier": "Standard",
        "soil_type": "Sandy",
    },
    # Edge cases
    {
        "city": "Mumbai",
        "plot_area_sqft": 10000,
        "builtup_area_sqft": 15000, # Large builtup
        "floors": 10,
        "bhk": 10,
        "material_tier": "Luxury",
        "soil_type": "Black Cotton",
    },
]

for i, payload in enumerate(test_payloads):
    try:
        cost = predict_construction_cost(payload)
        print(f"Test {i+1} success: {cost}")
    except Exception as e:
        print(f"Test {i+1} failed: {str(e)}")
        import traceback
        traceback.print_exc()
