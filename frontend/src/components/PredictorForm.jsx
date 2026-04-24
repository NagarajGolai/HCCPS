import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Wand2 } from "lucide-react";
import { CITY_OPTIONS, MATERIAL_OPTIONS, SOIL_OPTIONS } from "../constants";


export default function PredictorForm({
  formData,
  onChange,
  onSubmit,
  onAutoGenerate,
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
        <h2 className="pro-h1 mb-4">
          ML Cost Engine
        </h2>

        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          Live Random Forest predictions powered by your backend model. Updates instantly with market data.
        </p>
      </div>

      <div className="space-y-12">
        {/* SECTION 1: CORE DIMENSIONS */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-sky-500 rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">01. Core Dimensions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="pro-label">Market City</label>
              <select name="city" value={formData.city} onChange={onChange} disabled={blocked} className="pro-input">
                {CITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="pro-label">Finish Quality</label>
              <select name="material_tier" value={formData.material_tier} onChange={onChange} disabled={blocked} className="pro-input">
                {MATERIAL_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <InputField label="Built-up Area (sqft)" name="builtup_area_sqft" value={formData.builtup_area_sqft} onChange={onChange} min={250} max={15000} blocked={blocked} />
            <InputField label="BHK" name="bhk" value={formData.bhk} min={1} max={10} blocked={blocked} onChange={onChange} />
            <InputField label="Floors" name="floors" value={formData.floors} min={1} max={10} blocked={blocked} onChange={onChange} />
            <div>
              <label className="pro-label">Soil Type</label>
              <select name="soil_type" value={formData.soil_type} onChange={onChange} disabled={blocked} className="pro-input">
                {SOIL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: VASTU & ORIENTATION */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">02. Vastu & Orientation</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="pro-label">Main Facing</label>
              <select name="facing" value={formData.facing} onChange={onChange} disabled={blocked} className="pro-input">
                <option value="East">East (Recommended)</option>
                <option value="North">North</option>
                <option value="West">West</option>
                <option value="South">South</option>
              </select>
            </div>
            <div>
              <label className="pro-label">Kitchen Placement</label>
              <select name="kitchen_location" value={formData.kitchen_location} onChange={onChange} disabled={blocked} className="pro-input">
                <option value="South-East">South-East (Agni)</option>
                <option value="North-West">North-West</option>
                <option value="North-East">North-East</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="pro-label">Parking Capacity</label>
              <select name="parking_capacity" value={formData.parking_capacity} onChange={onChange} disabled={blocked} className="pro-input">
                <option value="None">None</option>
                <option value="1 Car">1 Car</option>
                <option value="2 Cars">2 Cars</option>
                <option value="3+ Cars">3+ Cars</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: INFRASTRUCTURE & ECO */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">03. Infrastructure & Eco</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="pro-label">Primary Water Source</label>
              <select name="water_source" value={formData.water_source} onChange={onChange} disabled={blocked} className="pro-input">
                <option value="Municipal">Municipal / City Line</option>
                <option value="Borewell">Borewell / Ground</option>
                <option value="Tanker">Tanker / External</option>
              </select>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer h-full">
              <input type="checkbox" name="has_solar" checked={formData.has_solar} onChange={(e) => onChange({ target: { name: 'has_solar', value: e.target.checked, type: 'checkbox' }})} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-sky-400 focus:ring-sky-500/30" />
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-wider">Solar Energy</p>
                <p className="text-[9px] text-slate-500">Eco-Score Bonus</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer h-full">
              <input type="checkbox" name="has_rainwater" checked={formData.has_rainwater} onChange={(e) => onChange({ target: { name: 'has_rainwater', value: e.target.checked, type: 'checkbox' }})} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-sky-400 focus:ring-sky-500/30" />
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-wider">Rainwater</p>
                <p className="text-[9px] text-slate-500">Water Conservation</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer h-full">
              <input type="checkbox" name="has_boundary_wall" checked={formData.has_boundary_wall} onChange={(e) => onChange({ target: { name: 'has_boundary_wall', value: e.target.checked, type: 'checkbox' }})} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-sky-400 focus:ring-sky-500/30" />
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-wider">Boundary Wall</p>
                <p className="text-[9px] text-slate-500">Security & Privacy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plot Slider */}
      {!blocked && (
        <div className="mt-12 p-8 rounded-3xl border border-white/5 bg-black/40 shadow-pro-soft">
          <div className="flex items-center justify-between mb-6">
            <label className="pro-label mb-0">Total Plot Area</label>
            <span className="font-black text-[#fbbf24] text-xl">{formData.plot_area_sqft.toLocaleString()} <span className="text-[10px] text-slate-500">SQFT</span></span>
          </div>
          <input
            type="range"
            name="plot_area_sqft"
            min="300"
            max="10000"
            step="50"
            value={formData.plot_area_sqft}
            onChange={onChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-[#fbbf24]"
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-4 font-black uppercase tracking-widest">
            <span>300 sqft</span>
            <span>10,000 sqft</span>
          </div>
          
          {formData.builtup_area_sqft < formData.plot_area_sqft * 0.45 && (
            <p className="mt-4 text-xs text-amber-400 font-medium">
              ⚠️ Built-up area is very low for this plot. The model expects at least 45% coverage ({(formData.plot_area_sqft * 0.45).toFixed(0)} sqft).
            </p>
          )}
        </div>
      )}

      {/* Status Messages */}
      <div className="space-y-4 mt-8">
        {apiError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl border border-rose-400/40 bg-rose-950/40 text-rose-200 font-semibold"
          >
            {apiError}
          </motion.div>
        )}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl border border-amber-400/40 bg-amber-950/30 text-amber-200 font-semibold"
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
        className="group mt-10 h-16 w-full rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 text-lg font-extrabold text-white shadow-pro-lift hover:shadow-pro-glow hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-sky-500/30 transition-all disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="transition-all group-hover:translate-x-3">
          {loading ? (
            <>
              <span className="inline-flex items-center gap-3">
                Computing estimate...
                <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </span>
            </>
          ) : (
            "Generate Construction Estimate"
          )}
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(251, 191, 36, 0.4)" }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onAutoGenerate}
        disabled={blocked}
        className="group relative mt-4 h-16 w-full rounded-2xl bg-[#fbbf24]/10 border-2 border-[#fbbf24]/30 text-lg font-black text-[#fbbf24] shadow-pro-lift hover:bg-[#fbbf24]/20 transition-all disabled:cursor-not-allowed disabled:opacity-60 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        <span className="relative flex items-center justify-center gap-3 transition-all group-hover:tracking-wider">
          <Sparkles className="w-5 h-5 animate-pulse" />
          Automated Floorplan Generator
          <Wand2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
        </span>
      </motion.button>
    </motion.form>
  );
}

function InputField({ label, name, value, onChange, min, max, blocked }) {
  return (
    <div>
      <label className="pro-label">
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
        className="pro-input text-lg font-mono font-bold focus:shadow-pro-glow disabled:opacity-50"
      />
    </div>
  );
}

