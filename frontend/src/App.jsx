import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import posthog from "posthog-js";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { fetchSubscriptionStatus, predictCost } from "./api/proptechApi";
import AnalysisPanel from "./components/AnalysisPanel";
import PricingModal from "./components/PricingModal";
import MyProjectsModal from "./components/MyProjectsModal";
import DeveloperSettings from "./components/DeveloperSettings";
import MarketDashboard from "./components/MarketDashboard";
import PredictionResult from "./components/PredictionResult";
import PredictorForm from "./components/PredictorForm";
import SEO from "./components/SEO";
import Footer from "./components/Footer";
import MainLayout from "./layouts/MainLayout";
import {
  analyzeEcoScore,
  analyzeVastuScore,
  generateBoq,
  generateFloorPlanElements,
} from "./utils/AnalysisEngine";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const FloorPlannerPage = lazy(() => import("./pages/FloorPlannerPage"));
const DevelopersPage = lazy(() => import("./pages/DevelopersPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

const FloorViewer = lazy(() => import("./components/FloorViewer"));
const AIArchitectChat = lazy(() => import("./components/AIArchitectChat"));
const ExportEngine = lazy(() => import("./components/ExportEngine"));
const ExportLayoutRender = lazy(() => import("./components/ExportLayoutRender"));

const INITIAL_FORM_STATE = {
  city: "Mumbai",
  plot_area_sqft: 1800,
  builtup_area_sqft: 1450,
  floors: 2,
  bhk: 3,
  material_tier: "Premium",
  soil_type: "Loamy",
  facing: "East",
  kitchen_location: "South-East",
  has_solar: false,
  has_rainwater: false,
  parking_capacity: "1 Car",
  water_source: "Municipal",
  has_boundary_wall: true,
  center_type: "Open",
  roofing: "Standard",
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [subscription, setSubscription] = useState({
    plan: "free",
    is_active: false,
  });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [customFloorPlan, setCustomFloorPlan] = useState(null);
  const floorPlanRef = useRef(null);
  const exportContainerRef = useRef(null);

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
    [formData, prediction?.predicted_cost_inr],
  );
  const canExport = subscription.plan === "pro" && subscription.is_active;

  const handleFieldChange = (event) => {
    const { name, value, type } = event.target;
    const parsed =
      type === "number" || name.includes("sqft") ? Number(value) : value;
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
      console.error("[PredictionError]", error);
      const responseData = error?.response?.data;
      
      if (responseData) {
        if (responseData.detail) {
          setApiError(responseData.detail);
        } else if (typeof responseData === 'object') {
          // Handle DRF field-level errors
          const messages = Object.entries(responseData)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(' ') : msgs}`)
            .join(' | ');
          setApiError(messages || "Validation failed.");
        } else {
          setApiError("Prediction API call failed.");
        }
      } else {
        setApiError("Network error: Could not reach prediction server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFloorPlan = useCallback(() => {
    const elements = generateFloorPlanElements(formData);
    setCustomFloorPlan(elements);
    navigate("/floorplanner");
  }, [formData, navigate]);

  const handleOpenFloorPlan = useCallback((plan) => {
    setCustomFloorPlan(plan.json_data);
    navigate("/floorplanner");
  }, [navigate]);

  const handleStartBlankDraft = useCallback(() => {
    setCustomFloorPlan([]);
    navigate("/floorplanner");
  }, [navigate]);

  const refreshSubscription = useCallback(async () => {
    try {
      const status = await fetchSubscriptionStatus();
      setSubscription(status);
    } catch (error) {
      console.warn(
        "[App] Subscription check failed (likely unauthenticated):",
        error,
      );
      setSubscription({ plan: "free", is_active: false });
    }
  }, []);

  const handleRequireAuth = useCallback(() => {
    setCheckoutOpen(false);
    navigate("/signin");
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
    
    const handleOpenProjects = () => setIsProjectsOpen(true);
    window.addEventListener('open-projects', handleOpenProjects);
    return () => window.removeEventListener('open-projects', handleOpenProjects);
  }, [location.pathname]);

  const renderPredictorPage = () => (
    <MainLayout user={user} onLogout={logout} onOpenProject={handleOpenFloorPlan}>
      <SEO
        title="AI Predictor Dashboard | PropVerse AI"
        description="Run ML-backed construction estimates with interactive 3D floor visualization and sustainability analytics."
        urlPath="/predictor"
      />
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
              <p className="text-xl text-slate-300 mb-6">
                Sign in to unlock predictions, exports, and Pro features.
              </p>
              <Link
                to="/signin"
                className="pro-btn-success inline-flex items-center gap-3 px-8 py-3 text-lg shadow-pro-lift hover:shadow-pro-glow pro-lift-hover"
              >
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
                onAutoGenerate={handleGenerateFloorPlan}
                onBlankDraft={handleStartBlankDraft}
                loading={loading}
                apiError={apiError}
                isAuthenticated={isAuthenticated}
              />
              <div className="pro-grid md:grid-cols-2 gap-6">
                <PredictionResult prediction={prediction} />
                <div className="pro-card p-8">
                  <h3 className="pro-h2 mb-6 text-pro-text-primary">
                    Project Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="pro-metric">
                      <p className="text-xs font-semibold uppercase tracking-wider text-pro-blue-300 mb-3">
                        Density
                      </p>
                      <p className="text-3xl font-bold text-pro-green-400">
                        {computedDensity}%
                      </p>
                    </div>
                    <div className="pro-metric">
                      <p className="text-xs font-semibold uppercase tracking-wider text-pro-blue-300 mb-3">
                        Config
                      </p>
                      <p className="text-2xl font-bold text-pro-blue-500">
                        {formData.bhk}BHK/{formData.floors}F
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <AnalysisPanel eco={eco} vastu={vastu} />
              <ExportEngine
                floorPlanRef={exportContainerRef}
                formData={formData}
                prediction={prediction}
                eco={eco}
                vastu={vastu}
                boq={boq}
                aiAdvice={aiAdvice}
                canExport={canExport}
                isAuthenticated={isAuthenticated}
                onRequireAuth={handleRequireAuth}
                onRequireUpgrade={() => setCheckoutOpen(true)}
              />
              <DeveloperSettings isAuthenticated={isAuthenticated} />
              <div className="absolute left-[-9999px] top-[-9999px] opacity-0 pointer-events-none">
                <div ref={exportContainerRef}>
                  <Suspense fallback={null}>
                    <ExportLayoutRender elements={customFloorPlan || generateFloorPlanElements(formData)} />
                  </Suspense>
                </div>
              </div>
            </div>

            <div className="pro-space-y lg:sticky lg:top-20 lg:max-h-[85vh] lg:overflow-y-auto lg:pr-4">
              <div
                ref={floorPlanRef}
                className="pro-card border-pro-green-200/30 p-6 shadow-pro-glow"
              >
                <Suspense
                  fallback={
                    <div className="p-6 text-slate-300">
                      Loading 3D preview…
                    </div>
                  }
                >
                  <FloorViewer formData={formData} onAutoGenerate={handleGenerateFloorPlan} />
                </Suspense>
              </div>
              <div className="pro-card p-8 shadow-pro-lift border-pro-blue-200/30">
                <Suspense
                  fallback={
                    <div className="p-6 text-slate-300">
                      Loading architect assistant…
                    </div>
                  }
                >
                  <AIArchitectChat
                    houseData={formData}
                    ecoScore={eco.score}
                    vastuScore={vastu.score}
                    predictedCostInr={prediction?.predicted_cost_inr || null}
                    onAdviceUpdate={setAiAdvice}
                  />
                </Suspense>
              </div>
            </div>
          </div>
          <PricingModal
            isOpen={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            onSucess={refreshSubscription}
          />
        </div>
      </div>
    </MainLayout>
  );

  const renderFloorPlannerPage = () => (
    <>
      <SEO
        title="Interactive Floor Planner CAD | PropVerse AI"
        description="Professional 2D CAD floor plan editor with layers, snap-to-grid, symbols library, DXF export and real-time cost estimation."
        urlPath="/floorplanner"
      />
      <Suspense
        fallback={
          <div className="p-6 text-nebula-text-secondary">
            Loading floor planner…
          </div>
        }
      >
        <FloorPlannerPage initialElements={customFloorPlan} formData={formData} />
      </Suspense>
    </>
  );

  return (
    <Suspense
      fallback={<div className="p-6 text-nebula-text-secondary">Loading…</div>}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        <Route
          path="/predictor"
          element={
            <ProtectedRoute>
              {renderPredictorPage()}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/floorplanner"
          element={
            <ProtectedRoute>
              {renderFloorPlannerPage()}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="/developers" element={<DevelopersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {location.pathname !== "/predictor" && location.pathname !== "/floorplanner" && (
        <Footer />
      )}

      <MyProjectsModal 
        isOpen={isProjectsOpen} 
        onClose={() => setIsProjectsOpen(false)} 
        onOpenProject={handleOpenFloorPlan}
      />
    </Suspense>
  );
}
