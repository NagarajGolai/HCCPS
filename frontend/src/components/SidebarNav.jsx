import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", label: "🏠 Predictor", icon: "📊" },
  { to: "/predictor", label: "🔮 Analysis", icon: "📈" },
  { to: "/", label: "💬 AI Architect", icon: "🤖" },
  { to: "/", label: "📊 Market Dash", icon: "📉" },
  { to: "/", label: "💰 Export Pro", icon: "📄" },
];

export default function SidebarNav({ isOpen, onClose }) {
  return (
    <motion.div
      initial={false}
      animate={{ x: isOpen ? 0 : -280 }}
      className="fixed left-0 top-0 z-50 h-full w-72 bg-slate-950/85 text-slate-100 backdrop-blur-xl shadow-pro-lift border-r border-slate-800 md:relative md:w-64 md:shadow-pro-soft pro-card"
    >
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-black bg-gradient-to-r from-pro-blue-600 to-pro-blue-700 bg-clip-text text-transparent">
          PropVerse Nav
        </h2>
        <button 
          className="md:hidden mt-4 p-3 rounded-2xl border border-slate-700 hover:border-sky-400/60 hover:bg-slate-900/60 transition-all text-slate-200 font-semibold" 
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <nav className="p-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all group pro-lift-hover text-slate-200 hover:text-sky-200 hover:shadow-pro-glow ${
              isActive 
                ? 'bg-gradient-to-r from-sky-500/15 to-violet-500/10 border border-sky-400/30 text-sky-200 font-semibold shadow-pro-glow' 
                : 'hover:bg-slate-900/50 border border-transparent'
            }`}
            onClick={onClose}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-pro-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
}

