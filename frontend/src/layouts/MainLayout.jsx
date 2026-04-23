import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function MainLayout({ children, user, onLogout }) {
  return (
    <div className="pro-layout pro-container">
      <motion.header
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-40 mb-12 pro-card p-6 shadow-pro-lift pro-lift-hover border-pro-blue-200/50 backdrop-blur-xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-pro-blue-300 mb-2">
              Construction Intelligence Platform
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold pro-h1">
              <Link to="/" className="pro-lift-hover group">
                PropVerse AI
              </Link>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-4 py-2 text-sm font-semibold bg-pro-bg-900/50 border border-pro-bg-400/50 rounded-xl backdrop-blur-xl truncate max-w-[200px]"
                >
                  {user.name || user.email}
                </motion.span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="pro-btn-secondary px-6 py-2.5 text-sm font-semibold shadow-pro-soft hover:shadow-pro-lift pro-lift-hover whitespace-nowrap"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="pro-btn px-6 py-2.5 text-sm font-semibold shadow-pro-soft hover:shadow-pro-lift pro-lift-hover"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </motion.header>
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}


