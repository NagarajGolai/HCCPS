import { motion } from "framer-motion";

export default function MainLayout({ children, user, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-950 bg-aurora-gradient text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5 shadow-glow backdrop-blur"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Premium Prop-Tech Intelligence
              </p>
              <h1 className="mt-1 bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                PropVerse AI Construction Studio
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-100">
                    {user.name || user.email}
                  </span>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-sm text-amber-200">
                  OTP Sign-In Required
                </span>
              )}
            </div>
          </div>
        </motion.header>
        {children}
      </div>
    </div>
  );
}
