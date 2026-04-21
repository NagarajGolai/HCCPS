import { motion, useReducedMotion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";

import AuthPageDecoration from "../components/auth/AuthPageDecoration";
import AuthTopNav from "../components/auth/AuthTopNav";
import SignUpForm from "../components/SignUpForm";
import SEO from "../components/SEO";
import { useAuth } from "../hooks/useAuth";

export default function SignUpPage() {
  const reduceMotion = useReducedMotion();
  const {
    user,
    isAuthenticated,
    initiateOtp,
    completeOtpVerification,
    otpLoading,
    loading: authLoading,
    devOtp,
    error: authError,
    message: authMessage,
    logout,
  } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/predictor" replace />;
  }

  return (
    <div className="min-h-screen bg-pro-bg-50">
      <SEO
        title="Sign up | PropVerse AI"
        description="Create your PropVerse AI account with passwordless OTP—construction estimates, 3D floor studio, and more."
        urlPath="/signup"
      />
      <div className="pro-container py-10 lg:py-16">
        <AuthTopNav user={user} isAuthenticated={isAuthenticated} onLogout={logout} active="signup" />

        <div className="pro-grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
              }
              className="pro-card shadow-pro-lift p-8 lg:p-10"
            >
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-pro-bg-600">
                Join the studio
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-pro-bg-900 mb-4 leading-tight pro-h1">
                Create PropVerse Account
              </h1>
              <p className="mb-8 text-lg text-pro-bg-600 leading-relaxed">
                Quick signup with email & OTP.
              </p>
              <div className="space-y-6">
                <SignUpForm
                  initiateOtp={initiateOtp}
                  completeOtpVerification={completeOtpVerification}
                  otpLoading={otpLoading}
                  loading={authLoading}
                  devOtp={devOtp}
                  error={authError}
                  message={authMessage}
                />
              </div>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduceMotion ? 0 : 0.35 }}
                className="mt-8 text-center text-md text-pro-bg-600"
              >
                Already registered?{" "}
                <Link to="/signin" className="font-bold text-pro-blue-600 hover:text-pro-blue-700 hover:underline transition-colors">
                  Sign in instead
                </Link>
              </motion.p>
            </motion.div>

            {/* Signup steps */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.45, duration: 0.45 }}
              className="mt-10 pro-grid gap-4 sm:grid-cols-2"
            >
              <div className="pro-card p-6 border-pro-blue-100 shadow-pro-soft">
                <p className="text-xs uppercase tracking-wider text-pro-bg-500 font-bold mb-3">Step 1</p>
                <p className="text-sm font-semibold text-pro-bg-900">Send OTP to your inbox</p>
              </div>
              <div className="pro-card p-6 border-pro-green-100 shadow-pro-soft">
                <p className="text-xs uppercase tracking-wider text-pro-bg-500 font-bold mb-3">Step 2</p>
                <p className="text-sm font-semibold text-pro-bg-900">Confirm the 6-digit code</p>
              </div>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <AuthPageDecoration mode="signup" />
          </div>
        </div>

        <motion.footer
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.5 }}
          className="mt-24 text-center text-sm text-pro-bg-500 pt-16 border-t border-pro-bg-200"
        >
          <Link to="/" className="font-medium text-pro-bg-600 hover:text-pro-blue-600 transition-colors">
            ← Back to home
          </Link>
        </motion.footer>
      </div>
    </div>
  );
}

