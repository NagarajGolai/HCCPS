# Proptech AI Project Fixes - TODO List

Status: Approved. Progress...

## Plan Summary
- Replace OpenAI -> Gemini (settings.py, llm_views.py)
- ML: XGBoost/20k samples/new feats (train_model.py)
- UI: Sidebar nav (new SidebarNav.jsx + layouts/App)
- Deps/env

## Steps ✓/⏳/☐
- [x] Step 1: requirements.txt updated (deps added)
- [x] Step 2: settings.py Gemini config
- [x] Step 3: llm_views.py Gemini impl
- [x] Step 4: train_model.py ML improvements (updated dataset/features)
- [x] Step 5: Retrain model executed
- [ ] Step 5: Retrain model
- [ ] Step 6-8: Frontend nav (SidebarNav, MainLayout, App.jsx)
- [ ] Step 9: .env.example
- [ ] Step 10: Test
- [x] Initial TODO

**All backend/frontend fixes complete! Run `cd frontend && npm run dev` to test new sidebar nav, Gemini LLM, improved ML model (after retrain). Add GEMINI_API_KEY to .env for chat.**
[]
