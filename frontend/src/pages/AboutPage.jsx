import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Target, Zap, Shield } from 'lucide-react';
import SEO from '../components/SEO';
import { GithubIcon, LinkedinIcon } from '../components/Footer';

export default function AboutPage() {
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

  const VALUES = [
    { icon: <Target className="text-blue-400" />, title: "Precision", desc: "Engineering architectural models with millimeter accuracy using advanced BIM logic." },
    { icon: <Zap className="text-purple-400" />, title: "Intelligence", desc: "Harnessing state-of-the-art AI to predict costs and optimize structural efficiency." },
    { icon: <Shield className="text-emerald-400" />, title: "Compliance", desc: "Seamless integration of Vastu and local building codes for stress-free planning." }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-slate-200 cursor-none">
      <SEO title="About Us | PropVerse AI" description="Our mission to revolutionize architecture through AI." />

      <AnimatePresence>
        {!isLoaded && (
          <motion.div key="intro" exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }} className="h-1 bg-blue-500 mb-4" />
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">THE MISSION</h2>
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.2 }} className="h-1 bg-purple-500 mt-4" />
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 rounded-full overflow-hidden border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
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
        <div className="absolute top-0 left-0 w-full h-[80vh]">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[200px]" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[200px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 pb-24 relative z-10">
        <button onClick={handleBack} className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest mb-8 group transition-colors cursor-none">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return Home
        </button>

        <div className="mb-24">
          <motion.h1 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-9xl font-black text-white italic uppercase tracking-tighter leading-none mb-8"
          >
            THE FUTURE OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">BUILDING.</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl leading-relaxed"
          >
            PropVerse AI was born at the intersection of architectural passion and computational power. We are redefining how humans visualize, calculate, and create their dream spaces.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {VALUES.map((val, idx) => (
            <motion.div 
              key={idx}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-white/30 transition-all"
            >
              <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform">{val.icon}</div>
              <h3 className="text-2xl font-black text-white uppercase italic mb-4">{val.title}</h3>
              <p className="text-slate-400 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative py-24 flex items-center justify-center overflow-hidden" onMouseEnter={() => setIsHoveringSthapati(true)} onMouseLeave={() => setIsHoveringSthapati(false)}>
          <motion.h1 className="text-[12vw] font-black italic uppercase tracking-tighter leading-none text-white select-none">
            Sthapati
          </motion.h1>
        </div>
      </div>
    </div>
  );
}
