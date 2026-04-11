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
      className="fixed left-0 top-0 z-50 h-full w-72 bg-slate-900/95 backdrop-blur-xl shadow-2xl md:relative md:w-64"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-cyan-300">PropVerse Nav</h2>
        <button className="md:hidden mt-4 p-2 rounded-lg hover:bg-slate-800" onClick={onClose}>✕</button>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-gradient-to-r from-cyan-500/20 text-cyan-200 shadow-glow' 
                : 'hover:bg-slate-800/50 text-slate-300'
            }`}
            onClick={onClose}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
}
