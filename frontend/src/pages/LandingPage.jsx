import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import SEO from "../components/SEO";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    title: "ML cost intelligence",
    body: "Random Forest–backed estimates tuned for Indian cities, materials, and soil context.",
    tone: "text-cyan-200",
  },
  {
    title: "3D floor studio",
    body: "Interactive visualization so stakeholders see spatial program and massing in one view.",
    tone: "text-sky-200",
  },
  {
    title: "Sustainability & Vastu",
    body: "Eco and Vastu scoring layered on your inputs—not bolted-on PDFs.",
    tone: "text-emerald-200",
  },
  {
    title: "Exports & pro workflow",
    body: "BOQ and exports for teams that need shareable deliverables, not just a number.",
    tone: "text-violet-200",
  },
];

export default function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();

  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? { duration: 0.01 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] };
  const itemTransition = reduceMotion ? { duration: 0.01 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] };
  const fadeUp = (delay = 0) =>
    reduceMotion
      ? { initial: false, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { ...itemTransition, delay },
        };

  return (
    <div className="min-h-screen bg-slate-950 bg-aurora-gradient text-slate-100">
      <SEO
        title="PropVerse AI | Smart Construction Intelligence"
        description="AI-powered construction planning with ML cost prediction, 3D floor intelligence, Vastu checks, and sustainability scoring."
        urlPath="/"
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-5 py-4 shadow-glow backdrop-blur"
        >
          <Link to="/" className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Premium Prop-Tech Intelligence
            </p>
            <p className="mt-1 bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
              PropVerse AI
            </p>
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <Link
              to="/signin"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-cyan-200"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-200 transition hover:border-violet-400 hover:bg-violet-500/20"
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
                  onClick={logout}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-200"
                >
                  Sign out
                </button>
                <Link
                  to="/predictor"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-900/35 transition hover:brightness-110 sm:px-5"
                >
                  Open studio
                </Link>
              </>
            ) : (
              <Link
                to="/predictor"
                className="rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-900/35 transition hover:brightness-110 sm:px-5"
              >
                Open studio
              </Link>
            )}
          </div>
        </motion.header>

        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <motion.p
              {...fadeUp(0)}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300"
            >
              Plan builds with confidence
            </motion.p>
            <motion.h1
              {...fadeUp(0.07)}
              className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-[3.25rem]"
            >
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                Construction intelligence
              </span>
              <span className="text-slate-100"> that matches how you actually design.</span>
            </motion.h1>
            <motion.p
              {...fadeUp(0.14)}
              className="mt-5 max-w-xl text-lg text-slate-400"
            >
              From city-level indices to plot-specific estimates, PropVerse AI unifies prediction, 3D
              context, and compliance-style signals in one studio-grade workspace.
            </motion.p>
            <motion.div
              {...fadeUp(0.21)}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/predictor"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 px-8 text-sm font-bold text-white shadow-lg shadow-cyan-900/35 transition hover:brightness-110"
              >
                Launch predictor
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-600 bg-slate-800/80 px-6 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-200"
              >
                Create free account
              </Link>
            </motion.div>
            <motion.p
              {...fadeUp(0.28)}
              className="mt-6 text-xs text-slate-500"
            >
              Already have access?{" "}
              <Link to="/signin" className="text-cyan-400/90 hover:text-cyan-300">
                Sign in
              </Link>{" "}
              · Studio at <span className="text-slate-400">/predictor</span>
            </motion.p>
          </div>

          <motion.div
            {...fadeUp(reduceMotion ? 0 : 0.18)}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan-500/15 via-transparent to-violet-500/15 blur-2xl" />
            <motion.div
              animate={
                reduceMotion
                  ? {}
                  : { y: [0, -6, 0] }
              }
              transition={
                reduceMotion
                  ? {}
                  : { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative rounded-2xl border border-cyan-400/25 bg-slate-900/80 p-6 shadow-glow backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Studio preview
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-100">Dynamic market + ML core</p>
              <p className="mt-2 text-sm text-slate-400">
                The dashboard you will see uses glass panels, aurora backdrop, and the same gradient
                system—so this page and the app feel like one product.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-700/70 bg-slate-800/55 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Estimates</p>
                  <p className="mt-2 text-lg font-semibold text-cyan-200">City-aware</p>
                </div>
                <div className="rounded-xl border border-slate-700/70 bg-slate-800/55 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Visualization</p>
                  <p className="mt-2 text-lg font-semibold text-violet-200">3D floor</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={transition}
          className="mt-24"
        >
          <h2 className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Get started
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-slate-400">
            Dedicated auth pages with the same OTP flow—no passwords to manage.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -12, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...itemTransition, delay: reduceMotion ? 0 : 0.05 }}
              whileHover={reduceMotion ? {} : { y: -4, transition: { type: "spring", stiffness: 400, damping: 24 } }}
            >
              <Link
                to="/signup"
                className="block h-full rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-slate-900/80 p-6 shadow-glow backdrop-blur transition hover:border-violet-400/50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">New user</p>
                <p className="mt-2 text-xl font-bold text-slate-100">Sign up</p>
                <p className="mt-2 text-sm text-slate-400">
                  Create your profile with name + email, then verify with a one-time code.
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-violet-200">
                  Go to /signup →
                </span>
              </Link>
            </motion.div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 12, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...itemTransition, delay: reduceMotion ? 0 : 0.12 }}
              whileHover={reduceMotion ? {} : { y: -4, transition: { type: "spring", stiffness: 400, damping: 24 } }}
            >
              <Link
                to="/signin"
                className="block h-full rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-slate-900/80 p-6 shadow-glow backdrop-blur transition hover:border-cyan-400/50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Returning</p>
                <p className="mt-2 text-xl font-bold text-slate-100">Sign in</p>
                <p className="mt-2 text-sm text-slate-400">
                  Use your existing email—we send a fresh code every time you log in.
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-200">
                  Go to /signin →
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={transition}
          className="mt-24"
        >
          <h2 className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Why teams use PropVerse
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-slate-400">
            Everything below mirrors the cards and metrics inside your construction studio.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.article
                key={f.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ...itemTransition, delay: reduceMotion ? 0 : i * 0.06 }}
                whileHover={reduceMotion ? {} : { y: -4 }}
                className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-5 shadow-glow backdrop-blur transition-shadow hover:border-slate-600/80"
              >
                <h3 className={`text-base font-semibold ${f.tone}`}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="mt-20 rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-8 text-center shadow-glow backdrop-blur md:p-12"
        >
          <h2 className="text-2xl font-bold text-slate-100 md:text-3xl">
            Ready to run your next estimate?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-400">
            Sign in or create an account, then open the predictor with the same premium UI end to end.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-violet-500/50 bg-violet-500/15 px-8 text-sm font-bold text-violet-100 transition hover:bg-violet-500/25"
            >
              Sign up
            </Link>
            <Link
              to="/predictor"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 px-10 text-sm font-bold text-white shadow-lg shadow-cyan-900/35 transition hover:brightness-110"
            >
              Go to construction studio
            </Link>
          </div>
        </motion.section>

        <footer className="mt-16 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} PropVerse AI · Prop-tech construction intelligence
        </footer>
      </div>
    </div>
  );
}
