import { motion } from "framer-motion";

function Badge({ score }) {
  const tone =
    score >= 85
      ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
      : score >= 70
        ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
        : score >= 55
          ? "border-amber-400/40 bg-amber-500/15 text-amber-200"
          : "border-rose-400/40 bg-rose-500/15 text-rose-200";
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {score}/100
    </span>
  );
}

export default function AnalysisPanel({ eco, vastu }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-5 shadow-glow backdrop-blur"
    >
      <h3 className="text-lg font-semibold text-slate-100">Vastu & Sustainability Engine</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-slate-400">Eco-Score</p>
            <Badge score={eco.score} />
          </div>
          <p className="mt-2 text-sm font-semibold text-emerald-200">{eco.label}</p>
          <p className="mt-2 text-xs text-slate-300">
            {eco.recommendation}. Improve by <strong>{eco.ecoGain} points</strong> (projected{" "}
            <strong>{eco.projectedScore}</strong>) with approximately{" "}
            <strong>{eco.costDeltaPercent}%</strong> cost impact.
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-slate-400">Vastu Compliance</p>
            <Badge score={vastu.score} />
          </div>
          <p className="mt-2 text-sm font-semibold text-cyan-200">{vastu.label}</p>
          <ul className="mt-2 space-y-1 text-xs text-slate-300">
            {vastu.findings.map((finding) => (
              <li key={finding}>- {finding}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
