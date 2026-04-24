import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MousePointer2, Square, Type, DoorOpen, Layout, Navigation, 
  Layers, Settings, Share2, Download, Database, Undo2, Redo2, 
  Maximize2, Cpu, Ruler, Box, ChevronLeft, ChevronRight, Zap, 
  Trash2, RotateCcw, Sun, Moon, Grid3X3, Palette, Car, TreePine, 
  Lamp, Bath, Monitor, Refrigerator, Briefcase, Archive, Sparkles
} from 'lucide-react';
import FloorPlanEditor from '../components/FloorPlanEditor';
import FloorPlan3D from '../components/FloorPlan3D';
import AIArchitectChat from '../components/AIArchitectChat';
import ExportEngine from '../components/ExportEngine';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import PricingModal from '../components/PricingModal';
import SEO from '../components/SEO';
import { analyzeEcoScore, analyzeVastuScore, generateBoq } from '../utils/AnalysisEngine';

const panelVariants = {
  hiddenLeft: { x: -400, opacity: 0 },
  hiddenRight: { x: 500, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const PRESET_COLORS = [
  "#fbbf24", "#38bdf8", "#818cf8", "#f472b6", "#34d399", "#f87171", "#94a3b8", "#ffffff"
];

const BIM_LIBRARY = [
  { id: 'door', icon: '🚪', label: 'Door', category: 'Openings' },
  { id: 'window', icon: '🪟', label: 'Window', category: 'Openings' },
  { id: 'sofa', icon: '🛋️', label: 'Sofa', category: 'Furniture' },
  { id: 'bed', icon: '🛏️', label: 'Bed', category: 'Furniture' },
  { id: 'cabinet', icon: '🗄️', label: 'Cabinet', category: 'Furniture' },
  { id: 'fridge', icon: '🧊', label: 'Fridge', category: 'Appliances' },
  { id: 'car', icon: '🚗', label: 'Car', category: 'Vehicle' },
  { id: 'bike', icon: '🏍️', label: 'Bike', category: 'Vehicle' },
  { id: 'tree', icon: '🌲', label: 'Tree', category: 'Exterior' },
  { id: 'desk', icon: '🖥️', label: 'Desk', category: 'Furniture' },
];

export default function FloorPlannerPage({ initialElements }) {
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState('select');
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [elements, setElements] = useState(initialElements || [
    { id: 'room-1', x: 200, y: 200, width: 400, height: 300, type: 'room', name: 'LIVING AREA', rotation: 0, color: "#fbbf24" },
  ]);

  useEffect(() => {
    if (initialElements) {
      setElements(initialElements);
      setHistory([initialElements]);
      setHistoryStep(0);
    }
  }, [initialElements]);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState('2d');
  const [lightingMode, setLightingMode] = useState('day'); // 'day', 'night', 'punk'
  const [showGrid, setShowGrid] = useState(true);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const subscription = useSubscription();
  
  const [formData, setFormData] = useState({
    city: "Mumbai", plot_area_sqft: 2400, builtup_area_sqft: 0, floors: 1, bhk: 3, material_tier: "Premium", soil_type: "Loamy",
  });

  const [history, setHistory] = useState([elements]);
  const [historyStep, setHistoryStep] = useState(0);

  const selectedElement = useMemo(() => 
    elements.find(el => el.id === selectedId), [elements, selectedId]
  );

  const handleUpdateElements = (newElements) => {
    setElements(newElements);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newElements);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const prev = history[historyStep - 1];
      setElements(prev);
      setHistoryStep(historyStep - 1);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const next = history[historyStep + 1];
      setElements(next);
      setHistoryStep(historyStep + 1);
    }
  };

  const deleteSelected = () => {
    if (selectedId) {
      const updated = elements.filter(el => el.id !== selectedId);
      handleUpdateElements(updated);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'v') setActiveTool('select');
      if (e.key.toLowerCase() === 'w') setActiveTool('wall');
      if (e.key.toLowerCase() === 'r') setActiveTool('room');
      if (e.key.toLowerCase() === 't') setActiveTool('text');
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y') { e.preventDefault(); redo(); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, elements, historyStep, history]);

  const updateProperty = (prop, value) => {
    if (selectedId) {
      const updated = elements.map(el => el.id === selectedId ? { ...el, [prop]: value } : el);
      handleUpdateElements(updated);
    }
  };

  const toggleLighting = () => {
    if (lightingMode === 'day') setLightingMode('night');
    else if (lightingMode === 'night') setLightingMode('punk');
    else setLightingMode('day');
  };

  const handleExport = () => {
    if (subscription.plan !== 'pro') {
      setIsPricingOpen(true);
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(elements, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "proverse_blueprint.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleShare = () => {
    if (subscription.plan !== 'pro') {
      setIsPricingOpen(true);
      return;
    }
    const dummyLink = window.location.href;
    navigator.clipboard.writeText(dummyLink).then(() => {
      alert("Project link copied to clipboard! You can now share your blueprint.");
    });
  };

  return (
    <div className="fixed inset-0 bg-[#020617] text-slate-100 font-sans flex flex-col overflow-hidden">
      <SEO title="Proverse Studio | Professional Floor Planner" description="High-performance architectural drafting suite." />
      
      <header className="h-14 bg-[#0f172a] border-b border-white/5 flex items-center justify-between px-6 z-[100] shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shadow-[0_0_15px_#fbbf24]" />
            <h1 className="text-[12px] font-black tracking-[0.3em] uppercase">PROVERSE <span className="text-[#fbbf24]">STUDIO</span></h1>
            {subscription.plan === 'pro' && (
              <div className="px-2 py-0.5 bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded text-[7px] font-black text-[#fbbf24] tracking-widest uppercase">Pro</div>
            )}
          </div>
          
          <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
            <button onClick={() => setViewMode('2d')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === '2d' ? 'bg-[#fbbf24] text-slate-950' : 'text-slate-500 hover:text-white'}`}>2D Drafting</button>
            <button onClick={() => setViewMode('3d')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === '3d' ? 'bg-[#fbbf24] text-slate-950' : 'text-slate-500 hover:text-white'}`}>3D Rendering</button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowGrid(!showGrid)} className={`p-1.5 rounded-lg border transition-all ${showGrid ? 'bg-[#fbbf24]/20 border-[#fbbf24] text-[#fbbf24]' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`} title="Toggle Grid"><Grid3X3 size={16} /></button>
            {viewMode === '3d' && (
              <button onClick={toggleLighting} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                {lightingMode === 'day' && <Sun size={14} className="text-yellow-400" />}
                {lightingMode === 'night' && <Moon size={14} className="text-blue-400" />}
                {lightingMode === 'punk' && <Sparkles size={14} className="text-pink-500" />}
                {lightingMode.toUpperCase()}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
            <button onClick={undo} className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 disabled:opacity-30" disabled={historyStep === 0}><Undo2 size={14} /></button>
            <button onClick={redo} className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 disabled:opacity-30" disabled={historyStep === history.length - 1}><Redo2 size={14} /></button>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-1.5 bg-[#fbbf24] text-slate-950 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-yellow-400 transition-all"><Share2 size={14} /> Share</button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"><Download size={14} /> Export</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <AnimatePresence>
          {leftSidebarOpen && (
            <motion.aside variants={panelVariants} initial="hiddenLeft" animate="visible" exit="hiddenLeft" className="absolute left-4 top-4 bottom-4 w-72 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl z-[90] shadow-2xl flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-2"><Navigation size={12} className="text-[#fbbf24]" /> Core Drafting</h3>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {[{id:'select',icon:<MousePointer2 size={18}/>,l:'Select'},{id:'wall',icon:<Layout size={18}/>,l:'Wall'},{id:'room',icon:<Square size={18}/>,l:'Room'},{id:'text',icon:<Type size={18}/>,l:'Text'}].map(tool => (
                    <button key={tool.id} onClick={() => setActiveTool(tool.id)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${activeTool === tool.id ? 'bg-[#fbbf24]/10 border-[#fbbf24] text-[#fbbf24]' : 'bg-black/20 border-transparent text-slate-500 hover:text-white'}`}>
                      {tool.icon}<span className="text-[8px] font-black uppercase">{tool.l}</span>
                    </button>
                  ))}
                </div>
                
                <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-2"><Database size={12} className="text-[#fbbf24]" /> BIM Library</h3>
                <div className="grid grid-cols-2 gap-2">
                  {BIM_LIBRARY.map(tool => (
                    <button key={tool.id} onClick={() => setActiveTool(tool.id)} className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-black/20 border-2 transition-all ${activeTool === tool.id ? 'border-[#fbbf24] bg-[#fbbf24]/5 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                      <span className="text-xl">{tool.icon}</span><span className="text-[8px] font-black uppercase tracking-wider">{tool.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="absolute inset-0 bg-[#0f172a] z-0">
          <AnimatePresence mode="wait">
            {viewMode === '2d' ? (
              <motion.div key="2d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                <FloorPlanEditor elements={elements} onUpdate={handleUpdateElements} activeTool={activeTool} setArea={setCalculatedArea} zoom={zoom} selectedId={selectedId} setSelectedId={setSelectedId} />
              </motion.div>
            ) : (
              <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                <FloorPlan3D elements={elements} lightingMode={lightingMode} setLightingMode={setLightingMode} showGrid={showGrid} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {rightSidebarOpen && (
            <motion.aside variants={panelVariants} initial="hiddenRight" animate="visible" exit="hiddenRight" className="absolute right-4 top-4 bottom-4 w-80 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl z-[90] shadow-2xl p-6 flex flex-col overflow-y-auto">
              {selectedElement ? (
                <div className="space-y-6 pb-6 border-b border-white/5">
                  <div className="flex items-center justify-between"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#fbbf24]">Properties</h3><button onClick={deleteSelected} className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-md"><Trash2 size={14} /></button></div>
                  <div className="space-y-4">
                    <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Name</label><input type="text" value={selectedElement.name} onChange={(e) => updateProperty('name', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] outline-none" /></div>
                    <div className="space-y-2"><label className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Palette size={10} /> Color</label><div className="flex flex-wrap gap-2">{PRESET_COLORS.map(c => (<button key={c} onClick={() => updateProperty('color', c)} className={`w-6 h-6 rounded-full border-2 transition-all ${selectedElement.color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`} style={{ backgroundColor: c }} />))}<input type="color" value={selectedElement.color || "#ffffff"} onChange={(e) => updateProperty('color', e.target.value)} className="w-6 h-6 rounded-full bg-transparent border-none cursor-pointer p-0 overflow-hidden" /></div></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Width (ft)</label><input type="number" value={Math.round(selectedElement.width / 4)} onChange={(e) => updateProperty('width', Number(e.target.value) * 4)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] outline-none" /></div>
                      <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Height (ft)</label><input type="number" value={Math.round(selectedElement.height / 4)} onChange={(e) => updateProperty('height', Number(e.target.value) * 4)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] outline-none" /></div>
                    </div>
                    <button onClick={() => updateProperty('rotation', (selectedElement.rotation + 45) % 360)} className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase hover:bg-white/10"><RotateCcw size={12} /> Rotate 45°</button>
                  </div>
                </div>
              ) : <div className="py-12 text-center border-b border-white/5"><p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Select an element</p></div>}
              <div className="space-y-6 pt-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#fbbf24]">BIM Output</h3>
                <div className="text-center py-4 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Built-Up Area</p>
                  <div className="text-4xl font-black text-white">{calculatedArea}<span className="text-xs text-[#fbbf24] ml-1">FT²</span></div>
                </div>
                
                <div className="relative group">
                  {subscription.plan !== 'pro' && (
                    <div className="absolute inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-[2px] flex items-center justify-center rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => setIsPricingOpen(true)}
                        className="px-4 py-2 bg-[#fbbf24] text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl transform scale-90 group-hover:scale-100 transition-all"
                      >
                        Unlock AI Architect
                      </button>
                    </div>
                  )}
                  <AIArchitectChat houseData={{ ...formData, builtup_area_sqft: calculatedArea }} />
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} onSucess={subscription.refresh} />

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4">
          <div className="bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 flex shadow-2xl items-center">
            <button onClick={() => setLeftSidebarOpen(!leftSidebarOpen)} className={`p-2.5 rounded-xl transition-all ${leftSidebarOpen ? 'bg-[#fbbf24] text-slate-950' : 'text-slate-500 hover:text-white'}`}><ChevronLeft size={16} /></button>
            <div className="w-px h-6 bg-white/10 mx-3" />
            <div className="flex items-center px-4 gap-4"><span className="text-[10px] font-black text-slate-500 w-10">{Math.round(zoom * 100)}%</span><input type="range" min="0.5" max="2.5" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-24 h-1 bg-white/10 rounded-full appearance-none accent-[#fbbf24] accent-pink-500 cursor-pointer" /></div>
            <div className="w-px h-6 bg-white/10 mx-3" />
            <button onClick={() => setRightSidebarOpen(!rightSidebarOpen)} className={`p-2.5 rounded-xl transition-all ${rightSidebarOpen ? 'bg-[#fbbf24] text-slate-950' : 'text-slate-500 hover:text-white'}`}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}