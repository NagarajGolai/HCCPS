import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
        className="pro-card p-6 shadow-pro-lift hover:shadow-pro-glow"
      >

      <div className="mb-10">
        <h2 className="text-4xl font-black bg-gradient-to-r from-pro-blue-600 to-pro-blue-700 bg-clip-text text-transparent mb-4 pro-h1">
          🤖 ML Cost Engine
        </h2>

        <p className="text-pro-bg-600 text-xl leading-relaxed mb-8">
          Live Random Forest predictions powered by your backend model. Updates instantly with market data.
        </p>
      </div>

      <div className="pro-grid lg:grid-cols-2 gap-8">
        <div>
          <label className="pro-label">
            City Market
          </label>

          <select
            name="city"
            value={formData.city}
            onChange={onChange}
            disabled={blocked}
            className="pro-input pro-select focus:shadow-pro-glow"
          >
            {CITY_OPTIONS.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-3 block text-sm font-bold uppercase tracking-[0.2em] text-coffee-tan">
            Finish Quality
          </label>
          <select
            name="material_tier"
            value={formData.material_tier}
            onChange={onChange}
            disabled={blocked}
            className="h-16 w-full rounded-3xl border border-coffee-latte/50 bg-coffee-dark/80 px-6 text-xl font-semibold text-coffee-cream focus:border-coffee-foam/70 focus:ring-4 focus:ring-coffee-latte/30 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-coffee-glow disabled:opacity-50"
          >
            {MATERIAL_OPTIONS.map(tier => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>
        </div>

        <InputField
          label="Built-up Area (sqft)"
          name="builtup_area_sqft"
          value={formData.builtup_area_sqft}
          onChange={onChange}
          min={250}
          max={15000}
          blocked={blocked}
        />

        <InputField
          label="Plot Size (sqft)"
          name="plot_area_sqft"
          value={formData.plot_area_sqft}
          onChange={onChange}
          min={300}
          max={10000}
          blocked={blocked}
        />

        <div className="lg:col-span-2">
          <label className="mb-3 block text-sm font-bold uppercase tracking-[0.2em] text-coffee-tan">
            Rooms & Structure
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputField label="BHK" name="bhk" value={formData.bhk} min={1} max={10} blocked={blocked} />
            <InputField label="Floors" name="floors" value={formData.floors} min={1} max={10} blocked={blocked} />
            <div>
              <label className="text-sm font-bold text-coffee-tan uppercase tracking-wider block mb-3">
                Soil Type
              </label>
              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={onChange}
                disabled={blocked}
                className="h-16 w-full rounded-3xl border border-coffee-latte/50 bg-coffee-dark/80 px-6 text-lg font-semibold text-coffee-cream focus:border-coffee-foam/70 focus:ring-4 focus:ring-coffee-latte/30 focus:outline-none transition-all shadow-lg hover:shadow-coffee-glow disabled:opacity-50"
              >
                {SOIL_OPTIONS.map(soil => (
                  <option key={soil} value={soil}>{soil}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Plot Slider */}
      {!blocked && (
        <div className="mt-8 p-6 bg-coffee-bean/20 border border-coffee-latte/40 rounded-3xl coffee-glow">
          <label className="block text-sm font-bold uppercase tracking-[0.2em] text-coffee-tan mb-4">
            Plot Size Range
          </label>
          <input
            type="range"
            name="plot_area_sqft"
            min="300"
            max="10000"
            step="50"
            value={formData.plot_area_sqft}
            onChange={onChange}
            className="w-full h-3 bg-coffee-dark/50 rounded-lg appearance-none cursor-pointer accent-coffee-cream [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-coffee-cream [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:shadow-coffee-glow"
          />
          <div className="flex justify-between text-xs text-coffee-tan mt-2 font-mono">
            <span>300 sqft</span>
            <span className="font-bold text-coffee-cream text-lg">{formData.plot_area_sqft.toLocaleString()} sqft</span>
            <span>10,000 sqft</span>
          </div>
        </div>
      )}

      {/* Status Messages */}
      <div className="space-y-4 mt-8">
        {apiError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl border-2 border-rose-500/50 bg-gradient-to-r from-rose-500/10 to-red-500/10 text-rose-200 font-semibold coffee-glow shadow-lg"
          >
            {apiError}
          </motion.div>
        )}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-200 font-semibold coffee-glow shadow-lg"
          >
            🔐 Sign in with OTP to unlock ML predictions and sync your Pro subscription.
            <Link to="/signin" className="ml-2 underline hover:text-amber-300 font-bold block mt-2">→ Sign In</Link>
          </motion.div>
        )}
      </div>

      {/* Run Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={blocked}
        className="group mt-12 h-20 w-full rounded-4xl bg-gradient-to-r from-coffee-roast via-coffee-latte to-coffee-cream text-2xl font-black text-coffee-dark shadow-2xl coffee-glow hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(212,196,168,0.8),0_25px_60px_-12px_rgba(62,42,29,0.6)] focus:outline-none focus:ring-8 focus:ring-coffee-latte/40 transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:brightness-75"
      >
        <span className="transition-all group-hover:translate-x-3">
          {loading ? (
            <>
              <span className="inline-flex items-center gap-3">
                Computing Neural Network...
                <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </span>
            </>
          ) : (
            "🚀 Generate Construction Estimate"
          )}
        </span>
      </motion.button>
    </motion.form>
  );
}

function InputField({ label, name, value, onChange, min, max, blocked }) {
  return (
    <div>
      <label className="mb-3 block text-sm font-bold uppercase tracking-[0.2em] text-coffee-tan">
        {label}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={blocked}
        className="h-16 w-full rounded-3xl border border-coffee-latte/50 bg-coffee-dark/80 px-6 text-2xl font-mono font-bold text-coffee-cream focus:border-coffee-foam/70 focus:ring-4 focus:ring-coffee-latte/30 focus:outline-none transition-all duration-300 shadow-xl hover:shadow-coffee-glow disabled:opacity-50"
      />
    </div>
  );
}

