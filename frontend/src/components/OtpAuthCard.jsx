import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function OtpAuthCard({
  purpose,
  title,
  subtitle,
  showFullName = false,
  initiateOtp,
  completeOtpVerification,
  otpLoading,
  loading,
  devOtp,
  error,
  message,
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [step, setStep] = useState("email"); // 'email' | 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [previousError, setPreviousError] = useState("");

  // Removed auto-submit OTP to prevent self validating without typing

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await initiateOtp({
        email,
        purpose,
        full_name: showFullName ? fullName : "",
      });
      setOtpSent(true);
      setStep("otp");
      console.log("Dev OTP preview:", devOtp);
    } catch (err) {
      console.error("OTP send failed:", err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;
    try {
      await completeOtpVerification({
        email,
        purpose,
        code: otp,
        full_name: showFullName ? fullName : "",
      });
    } catch (err) {
      console.error("OTP verify failed:", err);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pro-card p-12 flex items-center justify-center space-y-4"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pro-blue-500 mx-auto" />
        <p className="text-lg text-slate-300">Authenticating...</p>
      </motion.div>
    );
  }

  // Removed local success screen - parent useEffect handles redirect immediately after state update

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent mb-4">
          {title}
        </h2>
        <p className="text-base lg:text-lg text-slate-300 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          {showFullName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="pro-label block mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pro-input focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                placeholder="Engineering Team Lead"
                required
              />
            </motion.div>
          )}
          <div>
            <label className="pro-label block mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pro-input focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              placeholder="team@constructionco.in"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!email || otpLoading}
            className="pro-btn w-full h-14 text-lg font-bold shadow-pro-lift hover:shadow-pro-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {otpLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              "Send OTP Code"
            )}
          </motion.button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="pro-label block mb-2">OTP Code</label>
            <div className="relative">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                className="pro-input text-3xl font-mono tracking-[0.5em] text-center focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 placeholder-slate-600"
                placeholder="000000"
                autoFocus
              />
              {devOtp && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-400 font-mono bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/30"
                >
                  Dev: {devOtp}
                </motion.div>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-3">
              Sent to{" "}
              <span className="text-slate-300 font-medium">{email}</span>
            </p>
          </div>
          <div className="flex gap-4 text-sm pt-2">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex-1 text-blue-400 hover:text-blue-300 font-semibold py-2 hover:bg-blue-500/10 rounded-lg transition-all"
            >
              ← Change Email
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setStep("email");
              }}
              className="flex-1 text-slate-400 hover:text-slate-300 font-semibold py-2 hover:bg-slate-500/10 rounded-lg transition-all"
            >
              Resend OTP
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={otp.length !== 6}
            className="pro-btn-success w-full h-14 text-lg font-bold shadow-pro-lift hover:shadow-pro-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {otpLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify & Continue"
            )}
          </motion.button>
        </form>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="p-4 rounded-2xl border border-red-500/50 bg-red-500/10 text-red-200 font-semibold text-sm flex items-start gap-3"
        >
          <svg
            className="w-5 h-5 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="p-4 rounded-2xl border border-green-500/50 bg-green-500/10 text-green-200 font-semibold text-sm flex items-start gap-3"
        >
          <svg
            className="w-5 h-5 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{message}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
