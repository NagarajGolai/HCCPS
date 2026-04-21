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
        {/* Hero Section */}
        <motion.section {...fadeInUp(0)} className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-md font-bold uppercase tracking-wider text-pro-blue-400"
          >
            Construction Intelligence
          </motion.p>
          <motion.h1 
            {...fadeInUp(0.2)}
            className="pro-h1 mb-6 leading-tight max-w-4xl mx-auto"
          >
            PropVerse AI Platform
          </motion.h1>
          <motion.p 
            {...fadeInUp(0.4)}
            className="text-xl md:text-2xl text-pro-bg-400 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Professional AI tools for accurate cost prediction, CAD floor planning, live material pricing, and project analytics.
          </motion.p>
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            <motion.div {...fadeInUp(0.6)}>
              <Link
                to="/predictor"
                className="pro-btn group px-10 py-4 text-xl shadow-pro-lift hover:shadow-pro-glow pro-lift-hover"
              >
                <span className="transition-all group-hover:translate-x-4 flex items-center gap-4">
                  Launch Cosmic Estimator →
                </span>
              </Link>
            </motion.div>
            <motion.div {...fadeInUp(0.8)}>
              <Link
                to={isAuthenticated ? "/predictor" : "/signup"}
                className="pro-btn-secondary px-10 py-4 text-xl font-bold shadow-pro-soft hover:shadow-pro-lift pro-lift-hover"
              >
                {isAuthenticated ? "Nebula Dashboard" : "Enter Free Cosmos"}
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Hero Metrics */}
        <motion.section {...fadeInUp(1)} className="mb-24">
          <div className="pro-grid md:grid-cols-3 gap-8 items-center">
            <motion.div className="pro-metric">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-pro-green-100/50 to-pro-gold-100/50 flex items-center justify-center shadow-pro-soft">
                <svg className="w-10 h-10 text-pro-green-600" fill="currentColor" viewBox="0 0 80 80">
                  <path d="M20 20h40v10H20zM25 35h30v10H25zM15 50h50v10H15z"/>
                  <circle cx="25" cy="27" r="3"/>
                  <circle cx="55" cy="42" r="3"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-white mb-3">₹3.87 Cr</h3>
              <p className="text-gray-300 font-semibold text-base">Live Bangalore Rates</p>
              <p className="text-gray-400 text-xs">4BHK • 2500sqft • Premium</p>
            </motion.div>
            <div className="md:col-span-2 pro-grid md:grid-cols-2 gap-6">
              <motion.div className="pro-metric">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Steel TMT</p>
                <p className="text-3xl font-bold text-emerald-400">₹72/kg <span className="text-sm font-medium text-yellow-400">+1.8%</span></p>
              </motion.div>
              <motion.div className="pro-metric">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">OPC Cement</p>
                <p className="text-3xl font-bold text-emerald-400">₹398/bag</p>
              </motion.div>
            </div>
          </div>
          <motion.p 
            {...fadeInUp(1.2)}
            className="text-center mt-12 text-lg text-pro-bg-600 max-w-3xl mx-auto"
          >
            Updates instantly across 120+ Indian markets. Engineered for precision.
          </motion.p>
        </motion.section>

        {/* Features */}
        <motion.section 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-24 py-16"
        >
          <motion.h2 {...fadeInUp(0)} className="pro-h2 text-center mb-16 max-w-4xl mx-auto">
            Complete Engineering Platform
          </motion.h2>
          <div className="pro-grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeInUp(i * 0.1)}
                whileHover={{ y: -8 }}
                className="pro-card p-8 cursor-pointer pro-lift-hover group border-pro-blue-200/30 hover:border-pro-green-400/50 hover:shadow-pro-lift hover:scale-[1.02]"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pro-blue-100/50 to-pro-blue-200/50 flex items-center justify-center shadow-pro-soft group-hover:shadow-pro-lift group-hover:scale-105 transition-all">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-pro-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{feature.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pro-card py-20 text-center shadow-pro-lift"
        >
          <motion.h2 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className="pro-h2 mb-8 max-w-3xl mx-auto text-white"
          >
            Ready for Precision Engineering?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join engineering teams delivering precise construction intelligence.
          </motion.p>
          <div className="flex flex-col xl:flex-row gap-12 justify-center items-center max-w-5xl mx-auto">
            <Link
              to="/predictor"
              className="pro-btn w-full xl:w-auto px-12 py-5 text-xl shadow-pro-lift hover:shadow-pro-glow pro-lift-hover whitespace-nowrap"
            >
              <span className="inline-flex items-center gap-4">
                Cosmic Cost Estimate
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <Link
              to="/signup"
              className="pro-btn-success w-full xl:w-auto px-12 py-5 text-xl font-bold shadow-pro-lift hover:shadow-pro-glow pro-lift-hover"
            >
              Get Started Free
            </Link>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-lg text-gray-400"
          >
            <Link to="/signin" className="font-semibold text-pro-blue-400 hover:text-pro-blue-300 underline-offset-4 transition-all">Already registered? Sign in</Link>
          </motion.p>
        </motion.section>

        {/* Footer */}
        <footer className="mt-20 pt-12 pb-12 border-t border-pro-bg-600/30 text-center bg-pro-bg-900/30">
          <div className="pro-container">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="pro-h2 mb-6 max-w-2xl mx-auto text-white"
            >
              PropVerse AI
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto text-base"
            >
              Professional AI platform for construction intelligence.
            </motion.p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300 mb-8">
              <Link to="/predictor" className="pro-lift-hover px-4 py-2 rounded-xl text-gray-200 hover:text-pro-blue-400 transition-all hover:bg-pro-bg-800/50 px-6">Cost Estimator</Link>
              <Link to="/floorplanner" className="pro-lift-hover px-4 py-2 rounded-xl text-gray-200 hover:text-pro-blue-400 transition-all hover:bg-pro-bg-800/50 px-6">Floor Planner</Link>
              <Link to="/pricing" className="nebula-lift-hover px-8 py-4 rounded-nebula-xl text-nebula-text-primary hover:text-nebula-cyan transition-all hover:bg-nebula-purple/10 shadow-nebula-float">Pricing</Link>
              <Link to="/contact" className="nebula-lift-hover px-8 py-4 rounded-nebula-xl text-nebula-text-primary hover:text-nebula-cyan transition-all hover:bg-nebula-purple/10 shadow-nebula-float">Contact</Link>
            </div>
            <p className="text-sm text-nebula-text-secondary/70">
              © {new Date().getFullYear()} PropVerse Nebula • Engineered for cosmic construction
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

