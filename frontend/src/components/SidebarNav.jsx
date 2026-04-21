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
      className="fixed left-0 top-0 z-50 h-full w-72 bg-white/95 backdrop-blur-xl shadow-pro-lift border-r border-pro-bg-200 md:relative md:w-64 md:shadow-pro-soft pro-card"
    >
      <div className="p-6 border-b border-pro-bg-200">
        <h2 className="text-2xl font-black bg-gradient-to-r from-pro-blue-600 to-pro-blue-700 bg-clip-text text-transparent">
          PropVerse Nav
        </h2>
        <button 
          className="md:hidden mt-4 p-3 rounded-2xl border border-pro-bg-300 hover:border-pro-blue-300 hover:bg-pro-bg-100 transition-all text-pro-bg-600 hover:text-pro-blue-600 font-semibold" 
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
            className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all group pro-lift-hover text-pro-bg-700 hover:text-pro-blue-600 hover:shadow-pro-glow ${
              isActive 
                ? 'bg-gradient-to-r from-pro-blue-50 to-pro-blue-100 border border-pro-blue-200 text-pro-blue-700 font-semibold shadow-pro-glow' 
                : 'hover:bg-pro-bg-50 border border-transparent'
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

