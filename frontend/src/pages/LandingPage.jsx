import { motion, useReducedMotion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SEO from "../components/SEO";
import { useRef, useEffect } from 'react';

const features = [
  {
    title: "AI Cost Prediction",
    body: "Machine learning estimates fine-tuned for Indian construction realities, materials and markets.",
    icon: "📊"
  },
  {
    title: "Live Floor Studio", 
    body: "Interactive 3D CAD for instant BOQ, area calculations, and stakeholder presentations.",
    icon: "🏠"
  },
  {
    title: "Material Intelligence",
    body: "Steel, cement, aggregate rates from 100+ Indian cities updated daily.",
    icon: "⚙️"
  },
  {
    title: "Engineering Deliverables",
    body: "Team exports, API access, compliance documentation – production ready.",
    icon: "📄"
  },
];

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay: reduceMotion ? 0 : 0.2 + delay,
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.add('pro-scroll-smooth');
    }
    return () => document.body.classList.remove('pro-scroll-smooth');
  }, []);

  return (
    <div className="pro-layout">
      <SEO 
        title="PropVerse AI | Construction Intelligence Platform"
        description="Professional AI platform for construction cost prediction, floor planning CAD, and live material market intelligence."
        urlPath="/"
      />

      <div className="pro-section">
        <div className="pro-container">
          <div className="mb-16 rounded-3xl border border-slate-700/50 bg-gradient-to-b from-slate-900/60 to-slate-950/20 p-8 md:p-12 shadow-pro-soft">
            {/* Hero Section */}
            <motion.section {...fadeInUp(0)} className="text-center">
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 text-xs font-extrabold uppercase tracking-[0.28em] text-sky-300"
              >
                Construction Intelligence
              </motion.p>
              <motion.h1 
                {...fadeInUp(0.2)}
                className="pro-h1 mb-6 leading-tight max-w-4xl mx-auto"
              >
                PropVerse AI
              </motion.h1>
              <motion.p 
                {...fadeInUp(0.4)}
                className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10"
              >
                Accurate cost prediction, CAD floor planning, live material pricing, and analytics—engineered for Indian construction teams.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
                <motion.div {...fadeInUp(0.6)} className="w-full sm:w-auto">
                  <Link
                    to="/predictor"
                    className="pro-btn group inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 py-4 text-base md:text-lg shadow-pro-lift hover:shadow-pro-glow pro-lift-hover"
                  >
                    {isAuthenticated ? "Enter Studio Dashboard" : "Launch Estimator"}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </motion.div>
                {!isAuthenticated && (
                  <motion.div {...fadeInUp(0.8)} className="w-full sm:w-auto">
                    <Link
                      to="/signup"
                      className="pro-btn-secondary inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 text-base md:text-lg shadow-pro-soft hover:shadow-pro-lift pro-lift-hover"
                    >
                      Create free account
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.section>
          </div>

        {/* Hero Metrics */}
        <motion.section {...fadeInUp(1)} className="mb-20">
          <div className="pro-grid gap-6 md:grid-cols-3">
            <div className="pro-metric">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-2">Sample estimate</p>
              <p className="text-3xl font-extrabold text-slate-100">₹3.87 Cr</p>
              <p className="mt-2 text-sm text-slate-300">Bengaluru • 4BHK • 2500 sqft</p>
            </div>
            <div className="pro-metric">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-2">Market index</p>
              <p className="text-3xl font-extrabold text-emerald-300">Steel: ₹72/kg</p>
              <p className="mt-2 text-sm text-slate-300">Updated daily across cities</p>
            </div>
            <div className="pro-metric">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-2">Floor studio</p>
              <p className="text-3xl font-extrabold text-sky-200">2D/3D</p>
              <p className="mt-2 text-sm text-slate-300">Plan, export, and share</p>
            </div>
          </div>
          <p className="mt-8 text-center text-base text-slate-300">
            Built for fast decisions: estimator + materials + floor planning.
          </p>
        </motion.section>

        {/* Features */}
        <motion.section 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-20"
        >
          <motion.h2 {...fadeInUp(0)} className="pro-h2 text-center mb-10 max-w-4xl mx-auto">
            Complete platform for construction teams
          </motion.h2>
          <div className="pro-grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeInUp(i * 0.1)}
                whileHover={{ y: -8 }}
                className="pro-card p-7 cursor-pointer pro-lift-hover group hover:shadow-pro-lift hover:scale-[1.01]"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-slate-900/40 border border-slate-700/60 flex items-center justify-center shadow-pro-soft group-hover:shadow-pro-lift group-hover:scale-105 transition-all">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-sky-300 transition-colors">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed text-base">{feature.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pro-card py-16 text-center shadow-pro-lift"
        >
          <motion.h2 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className="pro-h2 mb-6 max-w-3xl mx-auto"
          >
            Ready for Precision Engineering?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-base md:text-lg text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Join engineering teams delivering precise construction intelligence.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-5xl mx-auto">
            <Link
              to="/predictor"
              className="pro-btn w-full sm:w-auto px-10 py-4 text-base md:text-lg shadow-pro-lift hover:shadow-pro-glow pro-lift-hover whitespace-nowrap"
            >
              <span className="inline-flex items-center gap-4">
                Run a cost estimate
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <Link
              to="/signup"
              className="pro-btn-success w-full sm:w-auto px-10 py-4 text-base md:text-lg font-extrabold shadow-pro-lift hover:shadow-pro-glow pro-lift-hover"
            >
              Get Started Free
            </Link>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-sm text-slate-400"
          >
            <Link to="/signin" className="font-semibold text-sky-300 hover:text-sky-200 underline underline-offset-4 transition-all">
              Already registered? Sign in
            </Link>
          </motion.p>
        </motion.section>

        {/* Footer */}
        <footer className="mt-16 pt-10 pb-10 border-t border-slate-800/60 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-sm text-slate-400"
          >
            © {new Date().getFullYear()} PropVerse AI • Construction intelligence platform
          </motion.p>
        </footer>
        </div>
      </div>
    </div>
  );
}

