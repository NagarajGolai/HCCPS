import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const GithubIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>;
export const LinkedinIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
export const TwitterIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-94 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;


export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800/60 bg-[#020617] text-slate-400 overflow-hidden z-20">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-all">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-widest text-white uppercase">PropVerse <span className="text-blue-400">AI</span></span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              The next-generation architectural intelligence platform. Streamline your floor planning, construction cost estimation, and Vastu compliance with state-of-the-art AI.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-900/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 border border-slate-800 hover:border-blue-500/50 transition-all">
                <TwitterIcon size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900/50 hover:bg-purple-500/20 text-slate-400 hover:text-purple-400 border border-slate-800 hover:border-purple-500/50 transition-all">
                <GithubIcon size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900/50 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/50 transition-all">
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/predictor" className="text-sm hover:text-blue-400 transition-colors">AI Predictor</Link></li>
              <li><Link to="/floorplanner" className="text-sm hover:text-blue-400 transition-colors">BIM Studio</Link></li>
              <li><button onClick={() => window.dispatchEvent(new CustomEvent('open-projects'))} className="text-sm hover:text-blue-400 transition-colors text-left">My Workspace</button></li>
              <li><Link to="/pricing" className="text-sm hover:text-blue-400 transition-colors">Pro Access</Link></li>
              <li><Link to="/signin" className="text-sm hover:text-blue-400 transition-colors">Cloud Login</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li>
                <Link to="/developers" className="group inline-flex items-center gap-2">
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">The Team</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-all">Meet Developers</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-mono tracking-wider">
            &copy; {new Date().getFullYear()} PROPVERSE AI. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono tracking-wider">
            <span>OPERATIONAL STATUS:</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SYSTEMS OPTIMAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
