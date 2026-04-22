import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import AuthPageDecoration from "../components/auth/AuthPageDecoration";
import AuthTopNav from "../components/auth/AuthTopNav";
import SignInForm from "../components/SignInForm";
import SEO from "../components/SEO";
import { useAuth } from "../hooks/useAuth";

export default function SignInPage() {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
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

  // Redirect to dashboard when successfully authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/predictor");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-pro-bg-primary">
      <SEO
        title="Sign in | PropVerse AI"
        description="Passwordless OTP sign-in to PropVerse AI construction intelligence and ML cost predictor."
        urlPath="/signin"
      />
      <div className="pro-container py-10 lg:py-16">
        <AuthTopNav
          user={user}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
          active="signin"
        />

        <div className="pro-grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <AuthPageDecoration mode="signin" />

          <div className="relative">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 opacity-60 blur-2xl" />
            <motion.div
              initial={
                reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
              }
              className="relative pro-card shadow-pro-lift p-8 lg:p-10 border border-blue-500/20"
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome back
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-blue-200 to-slate-100 bg-clip-text text-transparent mb-4 leading-tight">
                Sign in to PropVerse
              </h1>
              <p className="mb-10 text-base lg:text-lg text-slate-300 leading-relaxed max-w-md">
                Enter your email—we'll send a secure OTP to your inbox.
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
                className="mt-10 text-center text-sm text-slate-400"
              >
                New to PropVerse?{" "}
                <Link
                  to="/signup"
                  className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-cyan-300 transition-all"
                >
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
          className="mt-24 text-center text-sm text-slate-400 pt-12 border-t border-slate-800/50"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-blue-400 font-medium transition-colors"
          >
            ← Back to Construction Intelligence
          </Link>
        </motion.footer>
      </div>
    </div>
  );
}
