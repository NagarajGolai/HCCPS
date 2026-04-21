import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function OtpAuthCard({ 
  purpose, 
  title, 
  subtitle, 
  showFullName = false,
  initiateOtp, 
  completeOtpVerification, 
  otpLoading, 
  loading, 
  devOtp, 
  error, 
  message 
}) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await initiateOtp({ email, purpose, full_name: showFullName ? fullName : '' });
      setOtpSent(true);
      setStep('otp');
      console.log('Dev OTP preview:', devOtp);
    } catch (err) {
      console.error('OTP send failed:', err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;
    try {
      await completeOtpVerification({ email, purpose, code: otp, full_name: showFullName ? fullName : '' });
    } catch (err) {
      console.error('OTP verify failed:', err);
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pro-card p-12 flex items-center justify-center space-y-4"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pro-blue-500 mx-auto" />
        <p className="text-lg text-pro-bg-600">Authenticating...</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pro-card p-10 space-y-8"
    >
      <div>
        <h2 className="text-4xl font-black bg-gradient-to-r from-pro-blue-600 via-pro-blue-500 to-pro-purple-500 bg-clip-text text-transparent mb-4">
          {title}
        </h2>
        <p className="text-xl text-pro-bg-600 leading-relaxed">{subtitle}</p>
      </div>

      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          {showFullName && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <label className="pro-label">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pro-input"
                placeholder="Engineering Team Lead"
                required
              />
            </motion.div>
          )}
          <div>
            <label className="pro-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pro-input"
              placeholder="team@constructionco.in"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!email || otpLoading}
            className="pro-btn w-full h-16 text-xl shadow-pro-lift hover:shadow-pro-glow disabled:opacity-50"
          >
            {otpLoading ? 'Sending...' : `Send OTP Code`}
          </motion.button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="pro-label">OTP Code</label>
            <div className="relative">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\\D/g, ''))}
                maxLength={6}
                className="pro-input text-2xl font-mono tracking-wider text-center"
                placeholder="123456"
                autoFocus
              />
              {devOtp && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pro-green-500 font-mono bg-pro-green-100/50 px-2 py-1 rounded-lg">
                  Dev: {devOtp}
                </div>
              )}
            </div>
            <p className="text-sm text-pro-bg-500 mt-2">Sent to {email}</p>
          </div>
          <div className="flex gap-4 text-sm">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="flex-1 text-pro-blue-500 hover:text-pro-blue-600 font-semibold py-2"
            >
              ← Change Email
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setStep('email');
              }}
              className="flex-1 text-pro-bg-500 hover:text-pro-bg-600 font-semibold py-2"
            >
              Resend (60s)
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={otp.length !== 6}
            className="pro-btn-success w-full h-16 text-xl shadow-pro-lift hover:shadow-pro-glow disabled:opacity-50"
          >
            Verify & Continue
          </motion.button>
        </form>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl border-2 border-rose-400/30 bg-rose-50/50 text-rose-700 font-semibold"
        >
          {error}
        </motion.div>
      )}

      {message && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl border-2 border-emerald-400/30 bg-emerald-50/50 text-emerald-700 font-semibold"
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}
