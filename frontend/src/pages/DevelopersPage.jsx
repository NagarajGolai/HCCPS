import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2, ArrowLeft } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

// Anime Blobs
import nagarajImg from '../components/developers_items/Nagaraj_blob.jpg';
import praneetImg from '../components/developers_items/praneet_blob.jpg';
import abhishekImg from '../components/developers_items/abhi_blob.jpg';
import anuragImg from '../components/developers_items/anurag_blob.jpg';

const DEVELOPERS = [
  {
    name: "Nagaraj Golai",
    role: "Lead Developer",
    description: "Maintained End-to-end development including the idea, research, core AI integration, and 3D architectural rendering.",
    portfolio: "https://nagarajgolai.netlify.app",
    github: "https://github.com/nagarajgolai",
    linkedin: "https://www.linkedin.com/in/nagarajgolai",
    color: "from-blue-500 to-cyan-400",
    image: nagarajImg
  },
  {
    name: "Praneet Hukkeri",
    role: "Core Developer",
    description: "Instrumental in backend infrastructure, database schema design, and API optimization.",
    portfolio: "#",
    github: "#",
    linkedin: "#",
    color: "from-purple-500 to-pink-500",
    image: praneetImg
  },
  {
    name: "Abhishek Kocharagi",
    role: "UI Developer",
    description: "Spearheaded frontend logic, component architecture, and responsive user interfaces.",
    portfolio: "#",
    github: "#",
    linkedin: "#",
    color: "from-emerald-400 to-teal-500",
    image: abhishekImg
  },
  {
    name: "Anurag Desai",
    role: "Architect",
    description: "Managed data science pipelines, predictive modeling, and model training workflows.",
    portfolio: "#",
    github: "#",
    linkedin: "#",
    color: "from-orange-500 to-amber-400",
    image: anuragImg
  }
];

// Custom 3D Tilt Card Component
const DeveloperCard = ({ dev, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.21, 1.11, 0.81, 0.99] }}
      style={{ perspective: 1000 }}
      className="relative z-10 group"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full rounded-2xl bg-slate-900/80 border-2 border-slate-700/50 backdrop-blur-xl overflow-hidden p-8 hover:border-white transition-colors duration-300 shadow-2xl"
      >
        {/* Anime Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
           <img src={dev.image} alt={dev.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
           <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent`} />
        </div>

        {/* Anime Flash Effect */}
        <motion.div 
          className="absolute inset-0 bg-white z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.3 }}
        />

        {/* Glow effect behind card */}
        <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${dev.color} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500 -z-10`} />

        <div style={{ transform: "translateZ(50px)" }} className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                {dev.name}
              </h3>
              <p className={`text-sm font-black bg-clip-text text-transparent bg-gradient-to-r ${dev.color} mt-1 uppercase tracking-[0.2em]`}>
                {dev.role}
              </p>
            </div>
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${dev.color} p-[2px] shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500`}>
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                <img src={dev.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-8 flex-grow font-medium drop-shadow-lg" style={{ transform: "translateZ(30px)" }}>
            {dev.description}
          </p>

          <div className="flex items-center gap-4 pt-4 border-t border-white/10" style={{ transform: "translateZ(40px)" }}>
            <a href={dev.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 hover:bg-white text-white hover:text-black transition-all group/icon border border-white/10">
              <GithubIcon size={18} className="group-hover/icon:scale-110 transition-transform" />
            </a>
            <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 hover:bg-blue-500 text-white hover:text-white transition-all group/icon border border-white/10">
              <LinkedinIcon size={18} className="group-hover/icon:scale-110 transition-transform" />
            </a>
            <a href={dev.portfolio} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-white text-black hover:bg-transparent hover:text-white transition-all ml-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest group/link border border-white">
              Portfolio
              <ExternalLink size={14} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function DevelopersPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringSthapati, setIsHoveringSthapati] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    
    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) {
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
    setTimeout(() => {
      navigate('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-slate-200 cursor-none">
      <SEO title="Meet The Developers | PropVerse AI" description="The engineers behind PropVerse AI." />

      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            key="intro"
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5, ease: "circIn" }}
              className="h-1 bg-blue-500 mb-4"
            />
            <motion.h2 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase"
            >
              Initializing <span className="text-blue-500">Team</span>
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5, ease: "circOut", delay: 0.2 }}
              className="h-1 bg-purple-500 mt-4"
            />
            
            {/* Split Reveal Parts */}
            <motion.div 
              exit={{ x: "-100%" }}
              transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1] }}
              className="absolute inset-0 bg-blue-500/10 -z-10"
            />
          </motion.div>
        )}

        {isExiting && (
          <motion.div 
            key="outro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-white pointer-events-none"
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full border-2 border-white/50 pointer-events-none z-[100] mix-blend-difference flex items-center justify-center"
        animate={{
          x: mousePosition.x - (isHoveringSthapati ? 60 : 24),
          y: mousePosition.y - (isHoveringSthapati ? 60 : 24),
          scale: isHoveringSthapati ? 1 : (isHovering ? 1.8 : 1),
          width: isHoveringSthapati ? 120 : 48,
          height: isHoveringSthapati ? 120 : 48,
          backgroundColor: isHovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)'
        }}
        transition={{ type: "spring", stiffness: 2500, damping: 40, mass: 0.1 }}
      >
        {!isHovering && !isHoveringSthapati && <div className="w-1.5 h-1.5 bg-white rounded-full absolute" />}
        {isHoveringSthapati && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 rounded-full overflow-hidden border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          >
            <img 
              src="https://media.giphy.com/media/jzHFPlw89eTqU/giphy.gif" 
              className="w-full h-full object-cover mix-blend-screen opacity-100"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Abstract Background Elements - Anime Style Overhaul */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* CSS Speed Lines (More Performant than GIF) */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <motion.div 
            animate={{ x: [0, -400] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-[200%] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_100px,white_100px,white_102px)]"
          />
        </div>
        
        {/* Manga Panel Grid */}
        <div className="absolute inset-0 border-[40px] border-black z-10 opacity-30 pointer-events-none" />
        {/* Ambient Glows (Behind Cards) */}
        <div className="absolute top-0 left-0 w-full h-[80vh] pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[200px]" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[200px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 pb-24 relative z-10">
        <button 
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest mb-8 group transition-colors cursor-none"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Platform
        </button>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="overflow-hidden relative inline-block group">
            <motion.h1 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase italic relative"
            >
              The Minds Behind
              <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                The Architecture.
                <motion.div 
                  className="absolute inset-0 bg-white opacity-0 mix-blend-overlay"
                  animate={{ opacity: [0, 1, 0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </span>
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            A dedicated team of engineers, designers, and data scientists pushing the boundaries of construction tech and artificial intelligence.
          </motion.p>
        </div>

        {/* Developers Grid - 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {DEVELOPERS.map((dev, index) => (
            <DeveloperCard key={dev.name} dev={dev} index={index} />
          ))}
        </div>

        {/* Footer Sthapati Section with Interactive Blob Effect */}
        <motion.div 
          initial="initial"
          whileHover="hover"
          onMouseEnter={() => setIsHoveringSthapati(true)}
          onMouseLeave={() => setIsHoveringSthapati(false)}
          className="relative py-12 flex items-center justify-center overflow-hidden"
        >
          
          <motion.h1 
            variants={{
              initial: { scale: 1, rotate: 0 },
              hover: { scale: 1.05, rotate: 0 }
            }}
            className="text-[14vw] font-black italic uppercase tracking-tighter leading-none text-white select-none"
          >
            Sthapati
          </motion.h1>
        </motion.div>
      </div>
    </div>
  );
}
