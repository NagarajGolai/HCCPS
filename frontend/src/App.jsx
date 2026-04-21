import { useCallback, useEffect, useMemo, useRef, useState, useNavigate } from "react";
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
import FloorPlannerPage from "./pages/FloorPlannerPage";
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
  const navigate = useNavigate();
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
      console.warn("[App] Subscription check failed (likely unauthenticated):", error);
      setSubscription({ plan: "free", is_active: false });
    }
  }, []);

  const handleRequireAuth = useCallback(() => {
    setCheckoutOpen(false);
    navigate('/signin');
  }, [navigate]);

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

  const renderPredictorPage = () => (
    <MainLayout user={user} onLogout={logout}>
      <SEO title="AI Predictor Dashboard | PropVerse AI" description="Run ML-backed construction estimates with interactive 3D floor visualization and sustainability analytics." urlPath="/predictor" />
      <div className="pro-section">
        <div className="pro-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-8 pro-metric p-6 text-center"
          >
            <MarketDashboard />
          </motion.div>
          
          {!isAuthenticated && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              className="mb-10 pro-card p-8 shadow-pro-glow"
            >
              <p className="text-2xl text-nebula-text-secondary mb-8">Enter the Nebula to unlock cosmic predictions and Pro features</p>
              <Link to="/signin" className="pro-btn-success inline-flex items-center gap-3 px-8 py-3 text-lg shadow-pro-lift hover:shadow-pro-glow pro-lift-hover">
                Sign In →
              </Link>
            </motion.div>
          )}

          <div className="pro-grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12">
            <div className="pro-space-y lg:pr-4">
              <PredictorForm
                formData={formData}
                onChange={handleFieldChange}
                onSubmit={handlePredictSubmit}
                loading={loading}
                apiError={apiError}
                isAuthenticated={isAuthenticated}
              />
              <div className="pro-grid md:grid-cols-2 gap-6">
                <PredictionResult prediction={prediction} />
                <div className="pro-card p-8">
                  <h3 className="pro-h2 mb-6 text-pro-text-primary">Project Metrics</h3>
                  <div className="nebula-grid grid-cols-2 gap-6">
                    <div className="pro-metric">
                      <p className="text-xs font-semibold uppercase tracking-wider text-pro-blue-300 mb-3">Density</p>
                      <p className="text-3xl font-bold text-pro-green-400">{computedDensity}%</p>
                    </div>
                    <div className="pro-metric">
                      <p className="text-xs font-semibold uppercase tracking-wider text-pro-blue-300 mb-3">Config</p>
                      <p className="text-2xl font-bold text-pro-blue-500">{formData.bhk}BHK/{formData.floors}F</p>
                    </div>
                  </div>
                </div>
              </div>
              <AnalysisPanel eco={eco} vastu={vastu} />
              <ExportEngine
                floorPlanRef={floorPlanRef}
                formData={formData}
                prediction={prediction}
                eco={eco}
                vastu={vastu}
                boq={boq}
                canExport={canExport}
                isAuthenticated={isAuthenticated}
                onRequireAuth={handleRequireAuth}
                onRequireUpgrade={() => setCheckoutOpen(true)}
              />
              <DeveloperSettings isAuthenticated={isAuthenticated} />
            </div>

            <div className="pro-space-y lg:sticky lg:top-20 lg:max-h-[85vh] lg:overflow-y-auto lg:pr-4">
              <div ref={floorPlanRef} className="pro-card border-pro-green-200/30 p-6 shadow-pro-glow">
                <FloorViewer formData={formData} />
              </div>
              <div className="pro-card p-8 shadow-pro-lift border-pro-blue-200/30">
                <AIArchitectChat houseData={formData} ecoScore={eco.score} vastuScore={vastu.score} predictedCostInr={prediction?.predicted_cost_inr || null} />
              </div>
            </div>
          </div>
          <Checkout
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            user={user}
            isAuthenticated={isAuthenticated}
            onUpgradeSuccess={refreshSubscription}
            onRequireAuth={handleRequireAuth}
          />
        </div>
      </div>
    </MainLayout>
  );

  const renderFloorPlannerPage = () => (
    <MainLayout user={user} onLogout={logout}>
      <SEO title="Interactive Floor Planner CAD | PropVerse AI" description="Professional 2D CAD floor plan editor with layers, snap-to-grid, symbols library, DXF export and real-time cost estimation." urlPath="/floorplanner" />
      <div className="pro-layout">
        <div className="pro-container">
          <FloorPlannerPage />
        </div>
      </div>
    </MainLayout>
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/predictor" element={renderPredictorPage()} />
      <Route path="/floorplanner" element={renderFloorPlannerPage()} />
      <Route
        path="/admin"
        element={isAuthenticated && isAdminUser ? <AdminDashboard /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

