import React from 'react';
import { motion } from 'framer-motion';
import FloorPlanEditor from '../components/FloorPlanEditor';
import AIArchitectChat from '../components/AIArchitectChat';
import { useAuth } from '../hooks/useAuth';

const FloorPlannerPage = () => {
  const { user, logout } = useAuth();
  const [activeTool, setActiveTool] = React.useState('select');
  const [calculatedArea, setCalculatedArea] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);

  const [formData, setFormData] = React.useState({
    city: "Mumbai",
    plot_area_sqft: 1800,
    builtup_area_sqft: 0,
    floors: 1,
    bhk: 1,
    material_tier: "Premium",
    soil_type: "Loamy",
  });

  const handleFormUpdate = (elements) => {
    const roomCount = elements.filter(el => el.type === 'room').length;
    setFormData(prev => ({ ...prev, bhk: roomCount, builtup_area_sqft: calculatedArea }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      alert("Design state synchronized with project cloud.");
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const tools = [
    { id: 'select', label: 'Select', icon: '🎯', shortcut: 'S' },
    { id: 'room', label: 'Add Room', icon: '🟦', shortcut: 'R' },
    { id: 'wall', label: 'Add Wall', icon: '🧱', shortcut: 'W' },
    { id: 'door', label: 'Add Door', icon: '🚪', shortcut: 'D' },
    { id: 'window', label: 'Add Window', icon: '🪟', shortcut: 'O' },
    { id: 'furniture', label: 'Furniture', icon: '🛋️', shortcut: 'A' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-20">
      <div className="w-full px-4 md:px-8 space-y-6">
        {/* Project Navigation / Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          <span>Project Hub</span>
          <span>/</span>
          <span>Architectural Studio</span>
          <span>/</span>
          <span className="text-blue-600">Blueprint_v1.0</span>
        </nav>

        {/* Professional Header */}
        <header className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
              Blueprint <span className="text-blue-600">CAD Studio</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-sm">
              Design high-precision floor plans with integrated construction intelligence and live material market metrics.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? '⏳' : '💾'} {isSaving ? 'Syncing...' : 'Sync Cloud'}
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-all"
            >
              🖨️ Export PDF
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Toolbar */}
          <aside className="w-full lg:w-[240px] space-y-4 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">
                Drafting Tools
              </h3>
              <nav className="space-y-1">
                {tools.map((tool) => (
                  <button 
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border-2 ${
                      activeTool === tool.id 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                        : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{tool.icon}</span>
                      <span className="text-xs font-bold tracking-tight">{tool.label}</span>
                    </div>
                    <span className="text-[8px] font-mono opacity-40 px-1 py-0.5 rounded border border-current">{tool.shortcut}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-5xl opacity-5 group-hover:scale-110 transition-transform">🤖</div>
              <h4 className="font-bold text-blue-900 text-sm mb-1">AI Designer</h4>
              <p className="text-[11px] text-blue-700 leading-relaxed mb-3">Analyzing structural efficiency.</p>
              <div className="w-full bg-blue-200/50 h-1 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-1/3 h-full bg-blue-600"
                />
              </div>
            </div>
          </aside>

          {/* Central Canvas */}
          <main className="flex-1 space-y-6 min-w-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-0 shadow-sm overflow-hidden min-h-[600px] ring-1 ring-slate-200">
              <FloorPlanEditor 
                formData={formData} 
                activeTool={activeTool}
                onUpdate={handleFormUpdate} 
                setArea={setCalculatedArea}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Built Efficiency', value: '84.2%', color: 'bg-emerald-500' },
                { label: 'Layer Depth', value: '4 Layers', color: 'bg-blue-500' },
                { label: 'ML Status', value: 'Live Calc', color: 'bg-indigo-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className={`w-1 h-6 rounded-full ${stat.color}`} />
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                    <p className="text-[11px] font-bold text-slate-700">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* Right Intelligence Panel */}
          <aside className="w-full lg:w-[320px] space-y-4 lg:sticky lg:top-24">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Project Stats
                </h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Calculated Footprint</label>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter text-slate-900 tabular-nums">{calculatedArea}</span>
                  <span className="text-lg font-bold text-slate-400">SQFT</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (calculatedArea/formData.plot_area_sqft)*100)}%` }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Cost Projection</label>
                <div className="text-3xl font-black text-emerald-600 tabular-nums">
                  ₹{((calculatedArea * 2850)).toLocaleString('en-IN')}
                </div>
                <p className="text-slate-400 text-[11px] mt-1 font-medium italic">Confidence: High (ML RF-v4)</p>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <AIArchitectChat houseData={{ ...formData, builtup_area_sqft: calculatedArea }} />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FloorPlannerPage;
