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
    <div className="min-h-screen bg-slate-950 bg-aurora-gradient text-slate-100">
      <SEO
        title="Sign up | PropVerse AI"
        description="Create your PropVerse AI account with passwordless OTP—construction estimates, 3D floor studio, and more."
        urlPath="/signup"
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        <AuthTopNav user={user} isAuthenticated={isAuthenticated} onLogout={logout} active="signup" />

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,440px)_1fr] xl:grid-cols-[minmax(0,460px)_1.12fr] xl:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20 opacity-70 blur-xl" />
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
              }
              className="relative"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Join the studio</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-100 md:text-4xl">
                Create your{" "}
                <span className="bg-gradient-to-r from-violet-300 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
                  PropVerse profile
                </span>
              </h1>
              <p className="mt-3 text-sm text-slate-400">
                Name and email power your exports, chat context, and prediction history.
              </p>
              <div className="mt-8">
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
                className="mt-6 text-center text-sm text-slate-500"
              >
                Already registered?{" "}
                <Link to="/signin" className="font-semibold text-violet-300 transition hover:text-violet-200">
                  Sign in instead
                </Link>
              </motion.p>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <AuthPageDecoration mode="signup" />
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.45, duration: 0.45 }}
              className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
            >
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wider text-slate-500">Step 1</p>
                <p className="mt-1 text-sm font-medium text-slate-200">Send OTP to your inbox</p>
              </div>
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wider text-slate-500">Step 2</p>
                <p className="mt-1 text-sm font-medium text-slate-200">Confirm the 6-digit code</p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.footer
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.5 }}
          className="mt-16 text-center text-xs text-slate-500"
        >
          <Link to="/" className="text-slate-400 transition hover:text-cyan-300">
            ← Back to home
          </Link>
        </motion.footer>
      </div>
    </div>
  );
}
