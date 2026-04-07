import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { fetchMarketIndex } from "../api/proptechApi";

export default function MarketTicker() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const getData = async () => {
      try {
        const data = await fetchMarketIndex();
        if (mounted) {
          setRows(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (mounted) {
          setError("Unable to fetch market index feed.");
        }
      }
    };
    getData();
    const id = setInterval(getData, 30000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const tape = useMemo(
    () =>
      rows.map(
        (row) =>
          `${row.city} ${row.material}: ₹${Number(row.price_per_unit).toLocaleString("en-IN")} ${row.unit}`
      ),
    [rows]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/75 p-4 shadow-glow backdrop-blur"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
        Dynamic Market Index
      </h3>
      {error ? (
        <p className="mt-2 text-sm text-rose-300">{error}</p>
      ) : tape.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">Awaiting live material feeds...</p>
      ) : (
        <div className="relative mt-3 h-9 overflow-hidden rounded-lg border border-slate-700 bg-slate-800/70">
          <div className="ticker-track whitespace-nowrap py-2 text-sm text-slate-200">
            {[...tape, ...tape].map((line, index) => (
              <span key={`${line}-${index}`} className="mx-6 inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                {line}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
