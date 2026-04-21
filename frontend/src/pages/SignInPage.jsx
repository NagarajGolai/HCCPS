import { motion, useReducedMotion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";

import AuthPageDecoration from "../components/auth/AuthPageDecoration";
import AuthTopNav from "../components/auth/AuthTopNav";
import SignInForm from "../components/SignInForm";
import SEO from "../components/SEO";
import { useAuth } from "../hooks/useAuth";

export default function SignInPage() {
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
        title="Sign in | PropVerse AI"
        description="Passwordless OTP sign-in to PropVerse AI construction intelligence and ML cost predictor."
        urlPath="/signin"
      />
      <div className="pro-container py-10 lg:py-16">
        <AuthTopNav user={user} isAuthenticated={isAuthenticated} onLogout={logout} active="signin" />

        <div className="pro-grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <AuthPageDecoration mode="signin" />

          <div className="relative">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-pro-blue-50/30 via-white/10 opacity-50 blur-lg" />
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
              }
              className="relative pro-card shadow-pro-lift p-8 lg:p-10"
            >
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-pro-bg-600">
                Welcome back
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-pro-bg-900 mb-4 leading-tight pro-h1">
                Sign in to PropVerse
              </h1>
              <p className="mb-10 text-lg text-pro-bg-600 leading-relaxed max-w-md">
                Enter email—we'll send secure OTP to your inbox.
              </p>
              <div className="space-y-6">
                <SignInForm
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
                className="mt-10 text-center text-md text-pro-bg-600"
              >
                New to PropVerse?{" "}
                <Link to="/signup" className="font-bold text-pro-blue-600 hover:text-pro-blue-700 hover:underline transition-all">
                  Create engineering account
                </Link>
              </motion.p>
            </motion.div>
          </div>
        </div>

        <motion.footer
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.5 }}
          className="mt-24 text-center text-sm text-pro-bg-500 pt-12 border-t border-pro-bg-200"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-pro-bg-600 hover:text-pro-blue-600 font-medium transition-colors">
            ← Back to Construction Intelligence
          </Link>
        </motion.footer>
      </div>
    </div>
  );
}

