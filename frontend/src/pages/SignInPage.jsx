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
    <div className="min-h-screen bg-slate-950 bg-aurora-gradient text-slate-100">
      <SEO
        title="Sign in | PropVerse AI"
        description="Passwordless OTP sign-in to PropVerse AI construction intelligence and ML cost predictor."
        urlPath="/signin"
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        <AuthTopNav user={user} isAuthenticated={isAuthenticated} onLogout={logout} active="signin" />

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_minmax(0,420px)] xl:grid-cols-[1.15fr_minmax(0,440px)] xl:gap-16">
          <AuthPageDecoration mode="signin" />

          <div className="relative">
            <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/20 opacity-70 blur-xl" />
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Welcome back</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-100 md:text-4xl">
                Sign in to your{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                  workspace
                </span>
              </h1>
              <p className="mt-3 text-sm text-slate-400">
                Use the email already on your team— we will email a one-time code.
              </p>
              <div className="mt-8">
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
                className="mt-6 text-center text-sm text-slate-500"
              >
                New to PropVerse?{" "}
                <Link to="/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
                  Create an account
                </Link>
              </motion.p>
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
