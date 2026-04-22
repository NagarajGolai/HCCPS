# Frontend Fixes TODO - Auth Token Error

- [x] 1. Fix duplicate `previousError` state declaration in `OtpAuthCard.jsx`
- [x] 2. Remove unused `verificationSuccess` logic in `OtpAuthCard.jsx`  
- [x] 3. Fix auth token handling in api/client.js (added 401 response interceptor to clear stale tokens & redirect)
- [ ] 4. Improve PredictorForm error handling for 401
- [ ] 5. Test /predictor with/without auth
