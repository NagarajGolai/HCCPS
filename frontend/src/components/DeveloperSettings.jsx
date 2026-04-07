import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { fetchAPIKeys, generateAPIKey, revokeAPIKey } from "../api/proptechApi";

export default function DeveloperSettings({ isAuthenticated }) {
  const [keys, setKeys] = useState([]);
  const [name, setName] = useState("Primary Integration Key");
  const [monthlyLimit, setMonthlyLimit] = useState(10000);
  const [latestKey, setLatestKey] = useState("");
  const [loading, setLoading] = useState(false);

  const loadKeys = async () => {
    if (!isAuthenticated) return;
    const data = await fetchAPIKeys();
    setKeys(data);
  };

  useEffect(() => {
    loadKeys();
  }, [isAuthenticated]);

  const createKey = async () => {
    setLoading(true);
    const data = await generateAPIKey({ name, monthly_limit: Number(monthlyLimit) });
    setLatestKey(data.api_key);
    await loadKeys();
    setLoading(false);
  };

  const revokeKey = async (keyId) => {
    await revokeAPIKey(keyId);
    await loadKeys();
  };

  const copyKey = async () => {
    if (!latestKey) return;
    await navigator.clipboard.writeText(latestKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-5 shadow-glow backdrop-blur"
    >
      <h3 className="text-lg font-semibold text-slate-100">Developer Settings</h3>
      <p className="mt-1 text-sm text-slate-400">
        B2B API keys for enterprise integrations with usage quotas.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_140px]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-lg border border-slate-700 bg-slate-800/70 px-3 text-sm"
          placeholder="Key name"
        />
        <input
          type="number"
          min={100}
          max={100000}
          value={monthlyLimit}
          onChange={(e) => setMonthlyLimit(e.target.value)}
          className="h-11 rounded-lg border border-slate-700 bg-slate-800/70 px-3 text-sm"
        />
        <button
          type="button"
          onClick={createKey}
          disabled={!isAuthenticated || loading}
          className="h-11 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold text-white"
        >
          {loading ? "Generating..." : "Generate Key"}
        </button>
      </div>
      {latestKey && (
        <div className="mt-4 rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-3">
          <p className="text-xs text-cyan-200">Copy now. This key is shown once.</p>
          <div className="mt-2 flex gap-2">
            <code className="flex-1 overflow-x-auto rounded bg-slate-950/70 px-2 py-1 text-xs text-cyan-100">
              {latestKey}
            </code>
            <button
              type="button"
              onClick={copyKey}
              className="rounded bg-cyan-500 px-3 text-xs font-semibold text-slate-950"
            >
              Copy
            </button>
          </div>
        </div>
      )}
      <div className="mt-4 max-h-64 overflow-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-3 py-2">Key Prefix</th>
              <th className="px-3 py-2">Usage</th>
              <th className="px-3 py-2">Limit</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key.id} className="border-t border-slate-800">
                <td className="px-3 py-2 font-mono text-xs">{key.key_prefix}</td>
                <td className="px-3 py-2">{key.requests_made}</td>
                <td className="px-3 py-2">{key.monthly_limit}</td>
                <td className="px-3 py-2">
                  {key.is_active ? (
                    <button
                      type="button"
                      onClick={() => revokeKey(key.id)}
                      className="rounded border border-rose-500/50 px-2 py-1 text-xs text-rose-200"
                    >
                      Revoke
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">Revoked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
