import { motion } from "framer-motion";

export default function PredictionResult({ prediction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-5 shadow-glow backdrop-blur"
    >
      <h3 className="text-lg font-semibold text-slate-100">Prediction Output</h3>
      {!prediction ? (
        <p className="mt-2 text-sm text-slate-400">
          Submit the predictor form to retrieve your itemized construction estimate.
        </p>
      ) : (
        <>
          <div className="mt-3 rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4">
            <p className="text-xs uppercase tracking-wider text-cyan-300">Estimated Cost (INR)</p>
            <p className="mt-1 text-3xl font-bold text-cyan-100">
              {Number(prediction.predicted_cost_inr).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
            <Data label="City" value={prediction.city} />
            <Data label="Material" value={prediction.material_tier} />
            <Data label="Area" value={`${prediction.builtup_area_sqft} sq ft`} />
            <Data label="BHK" value={`${prediction.bhk}`} />
            <Data label="Floors" value={`${prediction.floors}`} />
            <Data label="Model" value={prediction.model_version} />
          </div>
        </>
      )}
    </motion.div>
  );
}

function Data({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700/70 bg-slate-800/60 p-3">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-100">{value}</p>
    </div>
  );
}
