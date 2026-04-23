import google.generativeai as genai
import os

# Your current key
API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

print("--- PROVERSE AI DIAGNOSTIC ---")
try:
    models = genai.list_models()
    found_any = False
    for m in models:
        # We only care about models that can generate text/content
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ AVAILABLE: {m.name}")
            found_any = True
    
    if not found_any:
        print("❌ No generation models found for this key.")
        
except Exception as e:
    print(f"❗ CRITICAL ERROR: {e}")
    print("\nPossible issues:")
    print("1. Your API key might be restricted or deleted (Rotate it!).")
    print("2. Your internet connection/proxy is blocking Google APIs.")
    print("3. The 'google-generativeai' library needs an update.")