import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthPanel({
  initiateOtp,
  completeOtpVerification,
  otpLoading,
  loading,
  devOtp,
  error,
  message,
}) {
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    purpose: "signin",
    code: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-glow backdrop-blur"
    >
      <h3 className="text-lg font-semibold text-slate-100">Secure OTP Identity</h3>
      <p className="mt-1 text-sm text-slate-400">
        Authenticate once to unlock instant ML price predictions.
      </p>
      <div className="mt-4 grid gap-3">
        <input
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email address"
          className="h-11 rounded-lg border border-slate-700 bg-slate-800/70 px-3 text-sm outline-none transition focus:border-cyan-400"
        />
        <input
          name="full_name"
          value={form.full_name}
          onChange={onChange}
          placeholder="Full name (for sign up)"
          className="h-11 rounded-lg border border-slate-700 bg-slate-800/70 px-3 text-sm outline-none transition focus:border-cyan-400"
        />
        <div className="grid grid-cols-2 gap-2">
          {["signin", "signup"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, purpose: mode }))}
              className={`h-10 rounded-lg border text-sm font-medium transition ${
                form.purpose === mode
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-100"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
              }`}
            >
              {mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            initiateOtp({
              email: form.email,
              full_name: form.full_name,
              purpose: form.purpose,
            })
          }
          disabled={otpLoading || !form.email}
          className="h-11 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {otpLoading ? "Requesting OTP..." : "Request OTP"}
        </button>
        <input
          name="code"
          value={form.code}
          onChange={onChange}
          placeholder="Enter 6-digit OTP"
          className="h-11 rounded-lg border border-slate-700 bg-slate-800/70 px-3 text-sm outline-none transition focus:border-cyan-400"
        />
        <button
          type="button"
          onClick={() =>
            completeOtpVerification({
              email: form.email,
              code: form.code,
              full_name: form.full_name,
              purpose: form.purpose,
            })
          }
          disabled={loading || form.code.length !== 6 || !form.email}
          className="h-11 rounded-lg border border-violet-500/60 bg-violet-500/15 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Verifying OTP..." : "Verify & Login"}
        </button>
      </div>

      {devOtp && (
        <p className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          Dev OTP Preview: <span className="font-mono font-bold">{devOtp}</span>
        </p>
      )}
      {message && (
        <p className="mt-3 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          {error}
        </p>
      )}
    </motion.div>
  );
}
