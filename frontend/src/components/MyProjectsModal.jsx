import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPredictionHistory, fetchFloorPlans, deleteFloorPlan } from '../api/proptechApi';
import { X, Clock, Database, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyProjectsModal({ isOpen, onClose, onOpenProject }) {
  const [predictions, setPredictions] = useState([]);
  const [floorPlans, setFloorPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [predData, planData] = await Promise.all([
        fetchPredictionHistory(),
        fetchFloorPlans()
      ]);
      setPredictions(predData.results || predData);
      setFloorPlans(planData.results || planData);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (confirm("Are you sure you want to delete this floor plan?")) {
      await deleteFloorPlan(id);
      loadData();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden bg-[#0f172a] border border-slate-700 rounded-3xl shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <h2 className="text-xl font-black text-white tracking-widest uppercase">My Projects & History</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-8 custom-scrollbar">
            {loading ? (
              <div className="text-center py-12 w-full text-slate-400">Loading your data...</div>
            ) : (
              <>
                <div className="flex-1 space-y-4">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-4">
                    <Clock size={16} className="text-cyan-400" /> Cost Predictions
                  </h3>
                  {predictions.length === 0 ? (
                    <p className="text-slate-500 text-sm">No predictions saved yet.</p>
                  ) : (
                    predictions.map(pred => (
                      <div key={pred.id} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-white">{pred.city} • {pred.bhk} BHK</span>
                          <span className="text-emerald-400 font-bold">₹{Number(pred.predicted_cost_inr).toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-slate-400 flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-slate-900 rounded">{pred.builtup_area_sqft} sqft</span>
                          <span className="px-2 py-1 bg-slate-900 rounded">{pred.material_tier}</span>
                          <span className="px-2 py-1 bg-slate-900 rounded">{new Date(pred.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-4">
                    <Database size={16} className="text-[#fbbf24]" /> Saved Floor Plans
                  </h3>
                  {floorPlans.length === 0 ? (
                    <p className="text-slate-500 text-sm">No floor plans saved yet.</p>
                  ) : (
                    floorPlans.map(plan => (
                      <div key={plan.id} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-between group hover:bg-slate-800 transition-colors">
                        <div>
                          <h4 className="font-bold text-white mb-1">{plan.title}</h4>
                          <p className="text-xs text-slate-400">{plan.total_area_sqft} sqft • {plan.bhk_count} BHK</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              onOpenProject(plan);
                              onClose();
                            }}
                            className="p-2 text-sky-400 hover:bg-sky-400/10 rounded-lg transition-colors"
                            title="Open in Studio"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeletePlan(plan.id)}
                            className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
