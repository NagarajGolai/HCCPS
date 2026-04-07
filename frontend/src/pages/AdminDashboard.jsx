import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  fetchAdminRevenue,
  fetchAdminStats,
  fetchCityMultipliers,
  updateCityMultipliers,
} from "../api/proptechApi";
import SEO from "../components/SEO";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenueRows, setRevenueRows] = useState([]);
  const [multipliers, setMultipliers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const [statsData, revenueData, multiplierData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminRevenue(),
        fetchCityMultipliers(),
      ]);
      setStats(statsData);
      setRevenueRows(revenueData);
      setMultipliers(multiplierData);
    }
    load();
  }, []);

  const chartData = useMemo(() => {
    const predMap = new Map((stats?.daily_predictions || []).map((row) => [row.day, row.count]));
    const signupMap = new Map((stats?.daily_signups || []).map((row) => [row.day, row.count]));
    const days = [...new Set([...predMap.keys(), ...signupMap.keys()])].sort();
    return days.map((day) => ({
      day: day.slice(5),
      predictions: predMap.get(day) || 0,
      signups: signupMap.get(day) || 0,
    }));
  }, [stats]);

  const onMultiplierChange = (index, value) => {
    setMultipliers((prev) =>
      prev.map((row, i) => (i === index ? { ...row, base_multiplier: Number(value) } : row))
    );
  };

  const onSaveMultipliers = async () => {
    setSaving(true);
    const payload = multipliers.map((row) => ({
      city: row.city,
      base_multiplier: Number(row.base_multiplier),
    }));
    const result = await updateCityMultipliers(payload);
    setMessage(result.detail);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SEO
        title="Panopticon Admin Dashboard | PropVerse AI"
        description="Super admin operations center for subscriptions, revenue, and AI model economics."
        urlPath="/admin"
      />
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-900/80 p-6">
          <h1 className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-2xl font-bold text-transparent">
            Panopticon
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Control Center</p>
          <div className="mt-8 space-y-3 text-sm">
            <SidebarStat label="Users" value={stats?.total_users ?? "..."} />
            <SidebarStat label="Predictions" value={stats?.total_predictions ?? "..."} />
            <SidebarStat
              label="Revenue"
              value={
                stats?.total_revenue_inr != null
                  ? `INR ${Number(stats.total_revenue_inr).toLocaleString("en-IN")}`
                  : "..."
              }
            />
          </div>
        </aside>

        <main className="p-6">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-glow"
          >
            <h2 className="text-lg font-semibold">Daily Predictions vs Signups</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="predictions" stroke="#22d3ee" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="signups" stroke="#a78bfa" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.section>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-glow">
              <h3 className="text-base font-semibold">Razorpay Revenue Table</h3>
              <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-slate-700">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="px-3 py-2">Order</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueRows.map((row) => (
                      <tr key={row.order_id} className="border-t border-slate-800">
                        <td className="px-3 py-2">{row.order_id}</td>
                        <td className="px-3 py-2">{row.email}</td>
                        <td className="px-3 py-2">INR {Number(row.amount_inr).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-glow">
              <h3 className="text-base font-semibold">30-City Economic Multipliers</h3>
              <div className="mt-3 max-h-72 space-y-2 overflow-auto pr-1">
                {multipliers.map((row, idx) => (
                  <div key={row.city} className="flex items-center justify-between rounded-md bg-slate-800/70 p-2">
                    <span className="text-sm text-slate-200">{row.city}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={row.base_multiplier}
                      onChange={(e) => onMultiplierChange(idx, e.target.value)}
                      className="h-9 w-24 rounded-md border border-slate-600 bg-slate-900 px-2 text-right text-sm"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={onSaveMultipliers}
                disabled={saving}
                className="mt-4 h-10 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-sm font-semibold text-white"
              >
                {saving ? "Saving..." : "Update Multipliers"}
              </button>
              {message && <p className="mt-2 text-xs text-emerald-300">{message}</p>}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarStat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-3">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-cyan-200">{value}</p>
    </div>
  );
}
