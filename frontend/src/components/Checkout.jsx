import { motion } from "framer-motion";

import { createRazorpayOrder, verifyRazorpayPayment } from "../api/proptechApi";

const PRO_PRICE_PAISE = 199900;

export default function Checkout({ open, onClose, user, onUpgradeSuccess }) {
  if (!open) return null;

  const handleUpgrade = async () => {
    const order = await createRazorpayOrder({ amount_paise: PRO_PRICE_PAISE, plan: "pro" });
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || order.key_id,
      amount: order.amount_paise,
      currency: order.currency,
      name: "PropVerse AI",
      description: "Pro Tier Subscription",
      order_id: order.order_id,
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: {
        color: "#06b6d4",
      },
      handler: async (response) => {
        await verifyRazorpayPayment(response);
        onUpgradeSuccess();
        onClose();
      },
    };

    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg rounded-2xl border border-cyan-400/25 bg-slate-900/90 p-6 shadow-glow"
      >
        <h3 className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-2xl font-bold text-transparent">
          Upgrade to Pro Tier
        </h3>
        <p className="mt-2 text-sm text-slate-300">
          Unlock unlimited PDF exports, higher prediction rate limits, and priority analytics
          throughput.
        </p>
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Monthly Plan</p>
          <p className="mt-1 text-3xl font-extrabold text-cyan-200">INR 1,999</p>
          <ul className="mt-3 space-y-1 text-sm text-slate-300">
            <li>- 100 predictions/day</li>
            <li>- Unlimited Master Blueprint exports</li>
            <li>- Fast-lane AI computation slot</li>
          </ul>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-lg border border-slate-600 bg-slate-800 font-semibold text-slate-200 transition hover:border-slate-400"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={handleUpgrade}
            className="h-11 flex-1 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 font-semibold text-white transition hover:brightness-110"
          >
            Pay Securely
          </button>
        </div>
      </motion.div>
    </div>
  );
}
