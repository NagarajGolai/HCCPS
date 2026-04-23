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

# User's failing inputs
payload = {
    "city": "Ahmedabad",
    "plot_area_sqft": 1800,
    "builtup_area_sqft": 500,
    "floors": 1,
    "bhk": 1,
    "material_tier": "Standard",
    "soil_type": "Hard Rock",
}

try:
    cost = predict_construction_cost(payload)
    print(f"Success: {cost}")
except Exception as e:
    print(f"Failed: {str(e)}")
