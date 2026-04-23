import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Star, ShieldCheck, X } from 'lucide-react';
import client from '../api/client';

export default function PricingModal({ isOpen, onClose, onSucess }) {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            // 1. Load Razorpay Script if not present
            if (!window.Razorpay) {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.async = true;
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
                    document.body.appendChild(script);
                });
            }

            // 2. Create Order on Backend
            const orderResponse = await client.post('/payments/create-order/', { 
                plan: 'pro', 
                amount_paise: 100 
            });

            const { order_id, amount_paise, currency, key_id } = orderResponse.data;

            // 3. Initialize Razorpay
            const options = {
                key: key_id,
                amount: amount_paise,
                currency: currency,
                name: "Proverse Studio",
                description: "Pro Subscription - Monthly Access",
                order_id: order_id,
                handler: async (response) => {
                    // 4. Verify Payment
                    try {
                        await client.post('/payments/verify-payment/', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        onSucess();
                        onClose();
                    } catch (err) {
                        console.error("Verification failed:", err);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: "User",
                    email: "user@example.com",
                },
                theme: {
                    color: "#fbbf24",
                },
                modal: {
                    confirm_close: true
                },
                config: {
                    display: {
                        blocks: {
                            upi: {
                                name: 'UPI / Google Pay / PhonePe',
                                instruments: [
                                    { method: 'upi' }
                                ]
                            }
                        },
                        sequence: ['block.upi', 'block.other'],
                        preferences: {
                            show_default_blocks: true
                        }
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Upgrade failed:", error);
            const msg = error.response?.data?.detail || error.message || "Initialization failed";
            alert(`Could not initialize payment: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-[#fbbf24]/10 rounded-xl">
                                <Zap className="text-[#fbbf24]" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">Upgrade to PRO</h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Professional Architectural Suite</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {[
                                { t: "Unlimited AI Architect Advice", d: "Get deep structural and design insights for every project." },
                                { t: "High-Fidelity Rendering", d: "Unlock advanced lighting modes including Neon-Stall." },
                                { t: "BIM Data Export", d: "Export detailed structural data as JSON and PDF." },
                                { t: "Priority Processing", d: "Faster calculations and AI response times." }
                            ].map((feat, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#fbbf24]/30 transition-all">
                                    <div className="mt-1 p-1 bg-[#fbbf24] rounded-full text-slate-950">
                                        <Check size={12} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">{feat.t}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">{feat.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-baseline justify-between px-2">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Access</div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-white">₹1,999</span>
                                    <span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">/ Month</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="w-full py-4 bg-[#fbbf24] hover:bg-yellow-400 text-slate-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#fbbf24]/10 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>Unlock Everything <Zap size={16} fill="currentColor" /></>
                                )}
                            </button>
                            
                            <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                <ShieldCheck size={12} /> Secure Payment powered by Razorpay
                            </p>
                        </div>
                    </div>
                    
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Star size={120} className="text-[#fbbf24]" />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
