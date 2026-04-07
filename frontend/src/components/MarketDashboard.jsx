import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { CITY_OPTIONS } from "../constants";

const BASE_PRICES = {
  "Grade-A Cement": 425,
  "TMT Steel": 61200,
  "River Sand": 68,
};

const CITY_FACTOR = CITY_OPTIONS.reduce((acc, city, index) => {
  const factor = 0.85 + (index / CITY_OPTIONS.length) * 0.55;
  acc[city] = Number(factor.toFixed(3));
  return acc;
}, {});

function buildInitialRows() {
  const rows = [];
  CITY_OPTIONS.forEach((city) => {
    Object.entries(BASE_PRICES).forEach(([material, base]) => {
      rows.push({
        city,
        material,
        value: Math.round(base * CITY_FACTOR[city]),
      });
    });
  });
  return rows;
}

export default function MarketDashboard() {
  const [rows, setRows] = useState(buildInitialRows);

  useEffect(() => {
    const timer = setInterval(() => {
      setRows((prev) =>
        prev.map((row) => {
          const drift = 1 + (Math.random() - 0.5) * 0.035;
          return { ...row, value: Math.max(1, Math.round(row.value * drift)) };
        })
      );
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const stream = useMemo(
    () =>
      rows.map((row) => {
        const unit =
          row.material === "TMT Steel" ? "per ton" : row.material === "River Sand" ? "per cu ft" : "per bag";
        return `${row.city} ${row.material}: ₹${row.value.toLocaleString("en-IN")} ${unit}`;
      }),
    [rows]
  );

  const topCities = useMemo(() => {
    const cityScore = CITY_OPTIONS.map((city) => {
      const subset = rows.filter((r) => r.city === city);
      const avg = subset.reduce((sum, row) => sum + row.value, 0) / subset.length;
      return { city, avg: Math.round(avg) };
    });
    return cityScore.sort((a, b) => b.avg - a.avg).slice(0, 5);
  }, [rows]);

  return (
    <motion.section
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-4 shadow-glow backdrop-blur"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Dynamic Market Dashboard
        </h2>
        <p className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
          Live Simulation: 30-City Construction Indices
        </p>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/55">
        <div className="ticker-track whitespace-nowrap py-2 text-xs text-slate-200">
          {[...stream, ...stream].map((line, index) => (
            <span key={`${line}-${index}`} className="mx-5 inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              {line}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-5">
        {topCities.map((city) => (
          <div
            key={city.city}
            className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-center"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">{city.city}</p>
            <p className="mt-1 text-sm font-semibold text-cyan-200">
              ₹{city.avg.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
