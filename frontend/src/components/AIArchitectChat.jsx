import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Stage, Layer, Text } from 'react-konva';
import client from '../api/client';

export default function AIArchitectChat({ houseData, ecoScore, vastuScore, predictedCostInr }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '🏗️ PropVerse AI Architect online. Share your design thoughts or ask about BOQ!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await client.post('/llm/architect-advice/', { 
        house_data: houseData,
        ecoScore: ecoScore,
        vastuScore: vastuScore,
        predictedCostInr: predictedCostInr,
        user_query: input
      });
      
      const aiMsg = { role: 'ai', content: data.advice || 'Engineering analysis complete. Ready for next query!' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = { role: 'ai', content: `⚠️ Service temporarily offline. ${error.message}` };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, houseData]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="space-y-4 h-[500px] flex flex-col"
    >
      <div className="text-lg font-extrabold mb-4 border-b border-slate-800 pb-4 text-slate-100">
        🤖 AI Architect Assistant
      </div>
      
      <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5 flex-1 overflow-hidden shadow-pro-soft flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 max-h-96">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-sky-500 to-violet-500 text-white' 
                  : 'bg-slate-900/70 border border-slate-800 text-slate-100'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="bg-slate-900/40 border border-slate-800/50 p-4 rounded-2xl flex items-center gap-3">
                <div className="flex gap-1">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </div>
                <p className="text-xs font-medium text-slate-400">Architect is analyzing...</p>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex gap-3 p-1 bg-slate-950/40 rounded-2xl border border-slate-800">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about foundation, BOQ, materials, or Vastu..."
            className="flex-1 bg-transparent border-none outline-none p-4 text-base text-slate-100 placeholder-slate-500 focus:placeholder-transparent"
            disabled={loading}
            maxLength={500}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="pro-btn-secondary px-6 py-3.5 font-bold whitespace-nowrap shadow-none hover:shadow-pro-lift disabled:opacity-50 min-w-[80px]"
          >
            {loading ? '...' : 'Send'}
          </motion.button>
        </div>
      </div>

      {predictedCostInr && (
        <div className="pro-metric p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200/50 rounded-2xl">
          <p className="text-sm uppercase tracking-wider text-emerald-600 font-bold mb-1">Live Estimate</p>
          <p className="text-2xl font-black text-emerald-700">₹{(predictedCostInr / 10000000).toLocaleString()} Cr</p>
        </div>
      )}
    </motion.div>
  );
}
