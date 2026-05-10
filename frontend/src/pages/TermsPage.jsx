import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, FileText, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';

export default function TermsPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringSthapati, setIsHoveringSthapati] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    const updateMousePosition = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updateMousePosition);
    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a') || e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const handleBack = (e) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => navigate('/'), 600);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-slate-200 cursor-none">
      <SEO title="Terms of Service | PropVerse AI" description="The rules of engagement for our platform." />

      <AnimatePresence>
        {!isLoaded && (
          <motion.div key="intro" exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }} className="h-1 bg-amber-500 mb-4" />
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">RULES OF ENGAGEMENT</h2>
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.2 }} className="h-1 bg-orange-500 mt-4" />
          </motion.div>
        )}
        {isExiting && <motion.div key="outro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-white pointer-events-none" transition={{ duration: 0.4 }} />}
      </AnimatePresence>

      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-2 border-white/50 pointer-events-none z-[100] mix-blend-difference flex items-center justify-center"
        animate={{
          x: mousePosition.x - (isHoveringSthapati ? 60 : 24),
          y: mousePosition.y - (isHoveringSthapati ? 60 : 24),
          width: isHoveringSthapati ? 120 : 48,
          height: isHoveringSthapati ? 120 : 48,
          scale: isHoveringSthapati ? 1 : (isHovering ? 1.8 : 1),
          backgroundColor: isHovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)'
        }}
        transition={{ type: "spring", stiffness: 2500, damping: 40, mass: 0.1 }}
      >
        {!isHovering && !isHoveringSthapati && <div className="w-1.5 h-1.5 bg-white rounded-full absolute" />}
        {isHoveringSthapati && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 rounded-full overflow-hidden border-2 border-amber-500">
            <img src="https://media.giphy.com/media/jzHFPlw89eTqU/giphy.gif" className="w-full h-full object-cover mix-blend-exclusion opacity-100" />
          </motion.div>
        )}
      </motion.div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <motion.div animate={{ x: [0, -400] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 w-[200%] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_100px,white_100px,white_102px)]" />
        </div>
        <div className="absolute inset-0 border-[40px] border-black z-10 opacity-30 pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-6 pb-24 relative z-10">
        <button onClick={handleBack} className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest mb-8 group transition-colors cursor-none">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
            TERMS OF <span className="text-amber-500">SERVICE.</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Version: 2026.1 | Legal Protocol Activated</p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors">
            <h2 className="text-2xl font-black text-white uppercase italic mb-4 flex items-center gap-3">
              <Scale size={24} className="text-amber-400" /> 1. Platform License
            </h2>
            <p>PropVerse AI grants you a personal, non-exclusive license to use our architectural AI services. All AI-generated outputs are yours to use commercially, provided you maintain a valid subscription.</p>
          </section>

          <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors">
            <h2 className="text-2xl font-black text-white uppercase italic mb-4 flex items-center gap-3">
              <FileText size={24} className="text-orange-400" /> 2. User Responsibilities
            </h2>
            <p>You are responsible for the accuracy of the structural data you provide. Our AI estimations are advisory and should be verified by a licensed structural engineer before construction begins.</p>
          </section>

          <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
            <h2 className="text-2xl font-black text-white uppercase italic mb-4 flex items-center gap-3">
              <AlertTriangle size={24} className="text-red-400" /> 3. Liability Limits
            </h2>
            <p>PropVerse AI is an analytical tool. We are not liable for construction failures, budget overruns, or legal non-compliance resulting from the direct application of AI predictions without professional human oversight.</p>
          </section>
        </div>

        <div className="relative py-24 flex items-center justify-center overflow-hidden" onMouseEnter={() => setIsHoveringSthapati(true)} onMouseLeave={() => setIsHoveringSthapati(false)}>
          <motion.h1 className="text-[10vw] font-black italic uppercase tracking-tighter leading-none text-white select-none">
            Sthapati
          </motion.h1>
        </div>
      </div>
    </div>
  );
}
