import { motion, useReducedMotion } from "framer-motion";

const cards = {
  signin: [
    {
      title: "Pick up where you left off",
      body: "Your saved context syncs across the construction studio and exports.",
      tone: "border-cyan-400/20 bg-cyan-500/5",
      accent: "text-cyan-200",
    },
    {
      title: "ML estimates on tap",
      body: "One OTP unlocks city-aware predictions and daily quota tracking.",
      tone: "border-violet-400/20 bg-violet-500/5",
      accent: "text-violet-200",
    },
    {
      title: "No passwords to rotate",
      body: "Email codes only—aligned with how your team already collaborates.",
      tone: "border-sky-400/20 bg-sky-500/5",
      accent: "text-sky-200",
    },
  ],
  signup: [
    {
      title: "Studio in minutes",
      body: "Create a profile with your name—we use it across reports and chat.",
      tone: "border-emerald-400/20 bg-emerald-500/5",
      accent: "text-emerald-200",
    },
    {
      title: "30-city intelligence",
      body: "Indices and multipliers tuned for how Indian construction markets move.",
      tone: "border-cyan-400/20 bg-cyan-500/5",
      accent: "text-cyan-200",
    },
    {
      title: "3D + sustainability",
      body: "Floor visualization, eco score, and Vastu signals in one workspace.",
      tone: "border-violet-400/20 bg-violet-500/5",
      accent: "text-violet-200",
    },
  ],
};

export default function AuthPageDecoration({ mode }) {
  const reduceMotion = useReducedMotion();
  const list = cards[mode];

  return (
    <div className="relative min-h-[280px] lg:min-h-[420px]">
      <div className="pointer-events-none absolute -left-8 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-4 top-0 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
        {list.map((card, i) => (
          <motion.article
            key={card.title}
            initial={reduceMotion ? false : { opacity: 0, x: -20, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { duration: 0.5, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] }
            }
            whileHover={reduceMotion ? {} : { x: 4, transition: { type: "spring", stiffness: 400, damping: 28 } }}
            className={`rounded-2xl border p-5 shadow-glow backdrop-blur ${card.tone}`}
          >
            <p className={`text-sm font-semibold ${card.accent}`}>{card.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.body}</p>
          </motion.article>
        ))}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduceMotion ? { duration: 0.01 } : { duration: 0.55, delay: 0.4 }}
          className="hidden rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5 sm:block lg:hidden"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">PropVerse</p>
          <p className="mt-2 text-lg font-semibold text-slate-200">Construction intelligence OS</p>
        </motion.div>
      </div>
    </div>
  );
}
