import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { fetchArchitectAdvice } from "../api/proptechApi";

export default function AIArchitectChat({
  houseData,
  ecoScore,
  vastuScore,
  predictedCostInr,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");
  const [error, setError] = useState("");

  const contextPayload = useMemo(
    () => ({
      house_data: houseData,
      eco_score: ecoScore,
      vastu_score: vastuScore,
      predicted_cost_inr: predictedCostInr,
    }),
    [houseData, ecoScore, vastuScore, predictedCostInr]
  );

  const getAdvice = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchArchitectAdvice(contextPayload);
      setAdvice(data.advice);
    } catch (e) {
      setError(e?.response?.data?.detail || "Unable to fetch architect advice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute bottom-4 right-4 w-80">
        {!open ? (
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpen(true)}
            className="w-full rounded-xl border border-cyan-400/40 bg-slate-900/85 px-4 py-3 text-left shadow-glow backdrop-blur"
          >
            <p className="text-xs uppercase tracking-wider text-cyan-300">Generative Architect</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">Ask AI about this live floor plan</p>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="rounded-xl border border-cyan-400/35 bg-slate-900/90 p-4 shadow-glow backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-cyan-200">AI Virtual Architect</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Uses strict structural context from your active plan + ML estimate.
            </p>
            <button
              type="button"
              onClick={getAdvice}
              disabled={loading}
              className="mt-3 h-10 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-sm font-semibold text-white"
            >
              {loading ? "Analyzing structure..." : "Generate Engineering Advice"}
            </button>
            {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
            {advice && (
              <div className="mt-3 max-h-64 overflow-auto rounded-lg border border-slate-700 bg-slate-950/70 p-3">
                <pre className="whitespace-pre-wrap text-xs text-slate-200">{advice}</pre>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
