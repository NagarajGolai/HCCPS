import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import FloorPlanEditor from '../components/FloorPlanEditor';
import AIArchitectChat from '../components/AIArchitectChat';
import SidebarNav from '../components/SidebarNav';

const FloorPlannerPage = () => {
  const { user } = useAuth();
  const subscription = { plan: 'free' };

  const [formData, setFormData] = React.useState({
    city: "Mumbai",
    plot_area_sqft: 1800,
    builtup_area_sqft: 1450,
    floors: 2,
    bhk: 3,
    material_tier: "Premium",
    soil_type: "Loamy",
  });

  const handleFormUpdate = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <MainLayout user={user}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="pro-section"
        >
<div className="pro-container space-y-8">
          {/* Header */}
          <div className="pro-card shadow-pro-lift">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="pro-h1 mb-6">
                  🏗️ Floor Plan CAD Studio
                </h1>
                <p className="text-xl text-pro-bg-600 leading-relaxed max-w-3xl">
                  Professional 2D CAD editor with snap-to-grid, layers, symbol libraries, DXF export, 
                  and real-time construction cost integration.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="pro-btn-success px-8 py-3.5 text-md font-bold shadow-pro-lift hover:shadow-pro-glow whitespace-nowrap"
                  onClick={() => window.print()}
                >
                  📄 Export DXF
                </motion.button>
                {subscription.plan !== 'pro' && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="px-10 py-5 border-2 border-pro-blue-200 bg-pro-blue-50 text-pro-blue-700 rounded-2xl font-bold text-lg hover:border-pro-blue-300 hover:bg-pro-blue-100 hover:shadow-pro-glow transition-all"
                  >
                    🔓 Upgrade Pro
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="pro-grid lg:grid-cols-[280px_1fr_320px] xl:grid-cols-[300px_1fr_340px] gap-6">
            {/* Left Toolbar */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-6 lg:max-h-[85vh] lg:overflow-y-auto pro-card shadow-pro-lift p-6 border-pro-blue-100"
            >
              <h3 className="pro-h2 mb-8 border-b border-pro-bg-200 pb-6 text-pro-bg-900">
                🛠️ CAD Tools
              </h3>
              <div className="space-y-4 mb-10">
                <div className="pro-grid grid-cols-2 gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="p-5 border-2 border-pro-bg-200 bg-pro-bg-50 rounded-2xl text-pro-blue-700 font-bold hover:border-pro-blue-300 hover:bg-pro-blue-50 hover:shadow-pro-glow transition-all text-sm pro-lift-hover"
                  >
                    🧱 Walls
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="p-5 border-2 border-pro-bg-200 bg-pro-bg-50 rounded-2xl text-pro-blue-700 font-bold hover:border-pro-blue-300 hover:bg-pro-blue-50 hover:shadow-pro-glow transition-all text-sm pro-lift-hover"
                  >
                    🚪 Doors
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="p-5 border-2 border-pro-bg-200 bg-pro-bg-50 rounded-2xl text-pro-blue-700 font-bold hover:border-pro-blue-300 hover:bg-pro-blue-50 hover:shadow-pro-glow transition-all text-sm pro-lift-hover"
                  >
                    🪟 Windows
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="p-5 border-2 border-pro-bg-200 bg-pro-bg-50 rounded-2xl text-pro-blue-700 font-bold hover:border-pro-blue-300 hover:bg-pro-blue-50 hover:shadow-pro-glow transition-all text-sm pro-lift-hover"
                  >
                    🪜 Stairs
                  </motion.button>
                </div>
              </div>
              <div className="space-y-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  className="w-full pro-btn px-6 py-5 text-sm shadow-pro-soft hover:shadow-pro-glow"
                >
                  🛋️ Furniture Library
                </motion.button>
                {subscription.plan === 'pro' ? (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    className="w-full pro-btn-success px-6 py-5 text-sm shadow-pro-lift hover:shadow-pro-glow"
                  >
                    🤖 AI Stair Generator
                  </motion.button>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    className="w-full px-6 py-5 border-2 border-pro-gold-200 bg-pro-gold-50 text-pro-gold-700 rounded-2xl font-bold hover:border-pro-gold-300 hover:bg-pro-gold-100 transition-all text-sm pro-lift-hover"
                  >
                    🔒 Pro: AI Stairs
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Canvas Area */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="aspect-[16/10] w-full bg-gradient-to-br from-pro-bg-50 to-white rounded-3xl border-2 border-dashed border-pro-bg-300 p-8 shadow-pro-lift overflow-hidden relative">
                {/* Subtle grid background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-[linear-gradient(90deg,#e5e7eb_1px,transparent_1px),linear-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] [background-position:0_0,0_0]" />
                </div>
<FloorPlanEditor formData={formData} onUpdate={handleFormUpdate} />
              </div>
            </motion.div>

            {/* Right Panel */}
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:sticky lg:top-6 lg:max-h-[85vh] lg:overflow-y-auto pro-card shadow-pro-lift p-6 border-pro-green-100"
            >
              <h3 className="pro-h2 mb-10 border-b border-pro-bg-200 pb-8 text-pro-bg-900">
                📋 Project Properties
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="pro-label mb-4">Live Cost Estimate</label>
                  <div className="text-5xl font-black bg-gradient-to-r from-pro-green-100 via-pro-green-200 to-pro-green-100 -mx-4 -my-4 p-8 rounded-3xl shadow-pro-glow">
                    ₹{((formData.builtup_area_sqft * 2850 / 10000000)).toLocaleString('en-IN', {maximumFractionDigits: 1})} Cr
                  </div>
                  <p className="text-pro-bg-600 text-sm mt-4 font-medium">Live estimate • {formData.material_tier} finish</p>
                </div>

                <div className="space-y-6">
                  <div className="pro-metric p-6">
                    <p className="text-xs uppercase text-pro-bg-500 font-bold mb-3 tracking-wider">Steel TMT Fe500</p>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-pro-green-400 to-pro-green-500 rounded-full shadow-lg" />
                      <span className="font-mono text-xl font-black text-pro-green-600">₹73/kg</span>
                      <span className="text-xs text-pro-green-600 font-semibold">(↑1.2%)</span>
                    </div>
                  </div>
                  <div className="pro-metric p-6">
                    <p className="text-xs uppercase text-pro-bg-500 font-bold mb-3 tracking-wider">OPC 53 Cement</p>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-pro-green-400 to-pro-green-500 rounded-full shadow-lg" />
                      <span className="font-mono text-xl font-black text-pro-green-600">₹415/bag</span>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-pro-bg-200 mt-10">
                  <AIArchitectChat houseData={formData} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default FloorPlannerPage;

