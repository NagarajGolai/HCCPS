import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import posthog from "posthog-js";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { fetchSubscriptionStatus, predictCost } from "./api/proptechApi";
import AnalysisPanel from "./components/AnalysisPanel";
import AIArchitectChat from "./components/AIArchitectChat";
import Checkout from "./components/Checkout";
import DeveloperSettings from "./components/DeveloperSettings";
import ExportEngine from "./components/ExportEngine";
import FloorViewer from "./components/FloorViewer";
import MarketDashboard from "./components/MarketDashboard";
import PredictionResult from "./components/PredictionResult";
import PredictorForm from "./components/PredictorForm";
import SEO from "./components/SEO";
import MainLayout from "./layouts/MainLayout";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { analyzeEcoScore, analyzeVastuScore, generateBoq } from "./utils/AnalysisEngine";
import { useAuth } from "./hooks/useAuth";

const INITIAL_FORM_STATE = {
  city: "Mumbai",
  plot_area_sqft: 1800,
  builtup_area_sqft: 1450,
  floors: 2,
  bhk: 3,
  material_tier: "Premium",
  soil_type: "Loamy",
};

export default function App() {
  const location = useLocation();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [subscription, setSubscription] = useState({ plan: "free", is_active: false });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const floorPlanRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();

  const computedDensity = useMemo(() => {
    const plot = Number(formData.plot_area_sqft);
    const builtup = Number(formData.builtup_area_sqft);
    if (!plot) return 0;
    return Math.round((builtup / plot) * 100);
  }, [formData.builtup_area_sqft, formData.plot_area_sqft]);

  const eco = useMemo(() => analyzeEcoScore(formData), [formData]);
  const vastu = useMemo(() => analyzeVastuScore(formData), [formData]);
  const boq = useMemo(
    () => generateBoq(formData, prediction?.predicted_cost_inr),
    [formData, prediction?.predicted_cost_inr]
  );
  const canExport = subscription.plan === "pro" && subscription.is_active;
  const isAdminUser = Boolean(user?.is_staff || user?.is_superuser);

  const handleFieldChange = (event) => {
    const { name, value, type } = event.target;
    const parsed = type === "number" || name.includes("sqft") ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: parsed }));
  };

  const handlePredictSubmit = async (event) => {
    event.preventDefault();
    setApiError("");
    setPrediction(null);
    try {
      setLoading(true);
      const result = await predictCost(formData);
      setPrediction(result);
    } catch (error) {
      setApiError(error?.response?.data?.detail || "Prediction API call failed.");
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = useCallback(async () => {
    try {
      const status = await fetchSubscriptionStatus();
      setSubscription(status);
    } catch (error) {
      setSubscription({ plan: "free", is_active: false });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscription();
    } else {
      setSubscription({ plan: "free", is_active: false });
    }
  }, [isAuthenticated, refreshSubscription]);

  useEffect(() => {
    posthog.capture("$pageview", { pathname: location.pathname });
  }, [location.pathname]);

  const renderConsumerPage = (seoTitle, seoDescription, seoPath) => (
    <MainLayout user={user} onLogout={logout}>
      <SEO title={seoTitle} description={seoDescription} urlPath={seoPath} />
      <MarketDashboard />
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 backdrop-blur"
        >
          <p className="text-sm text-amber-100">
            Sign in to run ML predictions and sync your subscription.
          </p>
          <Link
            to="/signin"
            className="shrink-0 rounded-lg border border-cyan-500/50 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-400 hover:bg-cyan-500/25"
          >
            Go to sign in
          </Link>
        </motion.div>
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.28fr)]">
        <div className="grid min-w-0 gap-6">
          <PredictorForm
            formData={formData}
            onChange={handleFieldChange}
            onSubmit={handlePredictSubmit}
            loading={loading}
            apiError={apiError}
            isAuthenticated={isAuthenticated}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <PredictionResult prediction={prediction} />
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-5 shadow-glow backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-100">Design Intelligence</h3>
              <div className="mt-3 grid gap-3 text-sm">
                <Metric title="Built-Up Density" value={`${computedDensity}%`} tone="text-cyan-200" />
                <Metric
                  title="Spatial Program"
                  value={`${formData.bhk} BHK / ${formData.floors} floors`}
                  tone="text-violet-200"
                />
                <Metric title="Material Strategy" value={formData.material_tier} tone="text-emerald-200" />
              </div>
            </div>
          </motion.div>
          <AnalysisPanel eco={eco} vastu={vastu} />
          <ExportEngine
            floorPlanRef={floorPlanRef}
            formData={formData}
            prediction={prediction}
            eco={eco}
            vastu={vastu}
            boq={boq}
            canExport={canExport}
            onRequireUpgrade={() => setCheckoutOpen(true)}
          />
          <DeveloperSettings isAuthenticated={isAuthenticated} />
        </div>

        <div className="grid min-w-0 gap-6 xl:sticky xl:top-6 xl:self-start xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto xl:pr-1">
          <div ref={floorPlanRef} className="relative flex flex-col gap-4">
            <FloorViewer
              formData={formData}
              onViewModeChange={(mode) => posthog.capture("floor_view_mode_toggled", { mode })}
            />
            <AIArchitectChat
              houseData={formData}
              ecoScore={eco.score}
              vastuScore={vastu.score}
              predictedCostInr={prediction?.predicted_cost_inr || null}
            />
          </div>
        </div>
      </div>
      <Checkout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        user={user}
        onUpgradeSuccess={refreshSubscription}
      />
    </MainLayout>
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/SignIn" element={<Navigate to="/signin" replace />} />
      <Route path="/SignUp" element={<Navigate to="/signup" replace />} />
      <Route
        path="/predictor"
        element={renderConsumerPage(
          "AI Predictor Dashboard | PropVerse AI",
          "Run ML-backed construction estimates with interactive 3D floor visualization and sustainability analytics.",
          "/predictor"
        )}
      />
      <Route
        path="/admin"
        element={isAuthenticated && isAdminUser ? <AdminDashboard /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Metric({ title, value, tone }) {
  return (
    <div className="rounded-lg border border-slate-700/70 bg-slate-800/55 p-3">
      <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
      <p className={`mt-1 text-base font-semibold ${tone}`}>{value}</p>
    </div>
  );
}
