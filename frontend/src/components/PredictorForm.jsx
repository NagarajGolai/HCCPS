import { motion } from "framer-motion";
import { CITY_OPTIONS, MATERIAL_OPTIONS, SOIL_OPTIONS } from "../constants";

export default function PredictorForm({
  formData,
  onChange,
  onSubmit,
  loading,
  apiError,
  isAuthenticated,
}) {
  const blocked = !isAuthenticated || loading;

  return (
    <motion.form
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-6 shadow-glow backdrop-blur"
    >
      <h2 className="text-xl font-semibold text-slate-100">ML Cost Predictor</h2>
      <p className="mt-1 text-sm text-slate-400">
        Live estimator synced with your backend Random Forest pipeline.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field
          label="City"
          name="city"
          value={formData.city}
          onChange={onChange}
          disabled={blocked}
          type="select"
          options={CITY_OPTIONS}
        />
        <Field
          label="Material Tier"
          name="material_tier"
          value={formData.material_tier}
          onChange={onChange}
          disabled={blocked}
          type="select"
          options={MATERIAL_OPTIONS}
        />
        <Field
          label="Built-up Area (sq ft)"
          name="builtup_area_sqft"
          value={formData.builtup_area_sqft}
          onChange={onChange}
          disabled={blocked}
          type="number"
          min={250}
          max={15000}
          step={1}
        />
        <Field
          label="BHK (Rooms)"
          name="bhk"
          value={formData.bhk}
          onChange={onChange}
          disabled={blocked}
          type="number"
          min={1}
          max={10}
          step={1}
        />
        <Field
          label="Floors"
          name="floors"
          value={formData.floors}
          onChange={onChange}
          disabled={blocked}
          type="number"
          min={1}
          max={10}
          step={1}
        />
        <Field
          label="Soil Type"
          name="soil_type"
          value={formData.soil_type}
          onChange={onChange}
          disabled={blocked}
          type="select"
          options={SOIL_OPTIONS}
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
          Plot Area (sq ft)
        </label>
        <input
          type="range"
          name="plot_area_sqft"
          min={300}
          max={10000}
          step={50}
          value={formData.plot_area_sqft}
          disabled={blocked}
          onChange={onChange}
          className="w-full accent-cyan-400"
        />
        <div className="mt-1 text-right text-sm text-cyan-200">
          {Number(formData.plot_area_sqft).toLocaleString("en-IN")} sq ft
        </div>
      </div>

      {apiError && (
        <p className="mt-4 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          {apiError}
        </p>
      )}
      {!isAuthenticated && (
        <p className="mt-4 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Complete OTP sign-in to invoke `/predict-cost/`.
        </p>
      )}

      <button
        type="submit"
        disabled={blocked}
        className="mt-5 h-12 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 text-sm font-bold text-white shadow-lg shadow-cyan-900/35 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? "Computing Neural Prediction..." : "Generate Construction Estimate"}
      </button>
    </motion.form>
  );
}

function Field({ label, type, options, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </label>
      {type === "select" ? (
        <select
          {...props}
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...props}
          type={type}
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
        />
      )}
    </div>
  );
}
