import { useState } from "react";
import { motion } from "framer-motion";

export default function OtpAuthCard({
  purpose,
  title,
  subtitle,
  showFullName,
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
    code: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const canRequestOtp = form.email.trim() && (!showFullName || form.full_name.trim());
  const canVerify = form.email && form.code.length === 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-6 shadow-glow backdrop-blur"
    >
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>

      <div className="mt-5 grid gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Email
          </label>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@company.com"
            className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
          />
        </div>
        {showFullName && (
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Full name
            </label>
            <input
              name="full_name"
              autoComplete="name"
              value={form.full_name}
              onChange={onChange}
              placeholder="Your name"
              className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() =>
            initiateOtp({
              email: form.email.trim(),
              full_name: form.full_name.trim(),
              purpose,
            })
          }
          disabled={otpLoading || !canRequestOtp}
          className="h-11 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 text-sm font-bold text-white shadow-lg shadow-cyan-900/35 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {otpLoading ? "Sending code…" : "Send OTP"}
        </button>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
            One-time code
          </label>
          <input
            name="code"
            inputMode="numeric"
            maxLength={6}
            value={form.code}
            onChange={onChange}
            placeholder="6-digit code"
            className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3 text-sm tracking-widest text-slate-100 outline-none transition focus:border-cyan-400"
          />
        </div>
        <button
          type="button"
          onClick={() =>
            completeOtpVerification({
              email: form.email.trim(),
              code: form.code,
              full_name: form.full_name.trim(),
              purpose,
            })
          }
          disabled={loading || !canVerify}
          className="h-11 rounded-lg border border-violet-500/60 bg-violet-500/15 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Verifying…" : purpose === "signup" ? "Create account" : "Sign in"}
        </button>
      </div>

      {devOtp && (
        <p className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          Dev OTP: <span className="font-mono font-bold">{devOtp}</span>
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
