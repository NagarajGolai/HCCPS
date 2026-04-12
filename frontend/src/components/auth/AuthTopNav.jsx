import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthTopNav({ user, isAuthenticated, onLogout, active }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0.01 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-5 py-4 shadow-glow backdrop-blur"
    >
      <Link to="/" className="group text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">PropVerse AI</p>
        <p className="mt-0.5 bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-lg font-bold text-transparent transition group-hover:opacity-90 md:text-xl">
          Construction Studio
        </p>
      </Link>
      <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          to="/signin"
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            active === "signin"
              ? "bg-cyan-500/20 text-cyan-100"
              : "text-slate-300 hover:text-cyan-200"
          }`}
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            active === "signup"
              ? "bg-violet-500/20 text-violet-100"
              : "text-slate-300 hover:text-violet-200"
          }`}
        >
          Sign up
        </Link>
        {isAuthenticated ? (
          <>
            <span className="hidden rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-100 sm:inline">
              {user?.name || user?.email}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-200"
            >
              Sign out
            </button>
            <Link
              to="/predictor"
              className="rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-900/35 transition hover:brightness-110"
            >
              Studio
            </Link>
          </>
        ) : (
          <Link
            to="/predictor"
            className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-100"
          >
            View studio
          </Link>
        )}
      </nav>
    </motion.header>
  );
}
