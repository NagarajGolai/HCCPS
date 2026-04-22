import client from "./client";

export async function requestOtp(payload) {
  const { data } = await client.post("/auth/request-otp/", payload);
  return data;
}

export async function verifyOtp(payload) {
  const { data } = await client.post("/auth/verify-otp/", payload);
  return data;
}

export async function predictCost(payload) {
  const { data } = await client.post("/predict-cost/", payload);
  return data;
}

export async function fetchPredictionHistory() {
  const { data } = await client.get("/prediction-history/");
  return data;
}

export async function fetchMarketIndex() {
  const { data } = await client.get("/market-index/");
  return data;
}

export async function fetchSubscriptionStatus() {
  const { data } = await client.get("/payments/subscription-status/");
  return data;
}

export async function createRazorpayOrder(payload) {
  const { data } = await client.post("/payments/create-order/", payload);
  return data;
}

export async function verifyRazorpayPayment(payload) {
  const { data } = await client.post("/payments/verify-payment/", payload);
  return data;
}

export async function fetchAdminStats() {
  const { data } = await client.get("/admin/stats/");
  return data;
}

export async function fetchAdminRevenue() {
  const { data } = await client.get("/admin/revenue/");
  return data;
}

export async function fetchCityMultipliers() {
  const { data } = await client.get("/admin/city-multipliers/");
  return data;
}

export async function updateCityMultipliers(payload) {
  const { data } = await client.put("/admin/city-multipliers/", payload);
  return data;
}

export async function fetchAPIKeys() {
  const { data } = await client.get("/b2b/keys/");
  return data;
}

export async function generateAPIKey(payload) {
  const { data } = await client.post("/b2b/keys/", payload);
  return data;
}

export async function revokeAPIKey(keyId) {
  const { data } = await client.post(`/b2b/keys/${keyId}/revoke/`);
  return data;
}

export async function fetchB2BCityEconomics() {
  const { data } = await client.get("/b2b/city-economics/");
  return data;
}

export async function b2bPredict(payload) {
  const { data } = await client.post("/b2b/predict/", payload);
  return data;
}

export async function fetchArchitectAdvice(payload) {
  const { data } = await client.post("/llm/architect-advice/", payload);
  return data;
}

export async function fetchFloorPlans() {
  const { data } = await client.get("/floorplans/");
  return data;
}

export async function createFloorPlan(payload) {
  const { data } = await client.post("/floorplans/", payload);
  return data;
}

export async function updateFloorPlan(id, payload) {
  const { data } = await client.put(`/floorplans/${id}/`, payload);
  return data;
}

export async function deleteFloorPlan(id) {
  const { data } = await client.delete(`/floorplans/${id}/`);
  return data;
}

export async function fetchFloorPlan(id) {
  const { data } = await client.get(`/floorplans/${id}/`);
  return data;
}

