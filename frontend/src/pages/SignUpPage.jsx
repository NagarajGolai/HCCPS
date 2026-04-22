import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import AuthPageDecoration from "../components/auth/AuthPageDecoration";
import AuthTopNav from "../components/auth/AuthTopNav";
import SignUpForm from "../components/SignUpForm";
import SEO from "../components/SEO";
import { useAuth } from "../hooks/useAuth";

export default function SignUpPage() {
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
        title="Sign up | PropVerse AI"
        description="Create your PropVerse AI account with passwordless OTP—construction estimates, 3D floor studio, and more."
        urlPath="/signup"
      />
      <div className="pro-container py-10 lg:py-16">
        <AuthTopNav
          user={user}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
          active="signup"
        />

        <div className="pro-grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="relative order-2 lg:order-1">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 opacity-60 blur-2xl" />
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
              className="pro-card shadow-pro-lift p-8 lg:p-10 border border-green-500/20"
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Join the studio
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-green-200 to-slate-100 bg-clip-text text-transparent mb-4 leading-tight">
                Create PropVerse Account
              </h1>
              <p className="mb-8 text-base lg:text-lg text-slate-300 leading-relaxed">
                Sign up with email & OTP. Join engineering teams worldwide.
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
                className="mt-8 text-center text-sm text-slate-400"
              >
                Already registered?{" "}
                <Link
                  to="/signin"
                  className="font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent hover:from-green-300 hover:to-emerald-300 transition-all"
                >
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
              <div className="pro-card p-6 border border-green-500/20 shadow-pro-soft hover:shadow-pro-lift hover:border-green-500/40 transition-all">
                <p className="text-xs uppercase tracking-wider bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold mb-3">
                  Step 1
                </p>
                <p className="text-sm font-semibold text-slate-200">
                  Send OTP to your inbox
                </p>
              </div>
              <div className="pro-card p-6 border border-emerald-500/20 shadow-pro-soft hover:shadow-pro-lift hover:border-emerald-500/40 transition-all">
                <p className="text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent font-bold mb-3">
                  Step 2
                </p>
                <p className="text-sm font-semibold text-slate-200">
                  Confirm the 6-digit code
                </p>
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
          className="mt-24 text-center text-sm text-slate-400 pt-16 border-t border-slate-800/50"
        >
          <Link
            to="/"
            className="font-medium text-slate-300 hover:text-green-400 transition-colors"
          >
            ← Back to home
          </Link>
        </motion.footer>
      </div>
    </div>
  );
}
