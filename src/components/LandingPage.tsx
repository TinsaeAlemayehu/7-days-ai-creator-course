import React from 'react';
import { motion } from 'motion/react';
import { Zap, Play, Star, Shield, Trophy } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onStart();
    } catch (error) {
      console.error("Login failed:", error);
      // Fallback for demo if popup is blocked
      onStart();
    }
  };
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] -ml-32 -mb-32 animate-pulse delay-1000" />

      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-400 to-indigo-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase font-display">AI CREATOR</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-12 pb-32 grid lg:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-10"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            <Star size={14} fill="currentColor" />
            Limited Beta: 7-Day Challenge 
          </div>
          <h1 className="text-8xl font-black text-white leading-[0.85] tracking-tighter font-display">
            THE MAGIC<br />
            OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">CREATION.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-md leading-relaxed">
            Forget homework. Enter a 7-day adventure where you build real worlds, characters, and code using AI. 🚀
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <button 
              onClick={handleLogin}
              className="group relative bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
            >
              Start Mission
              <Play fill="currentColor" size={20} />
            </button>
            
            <div className="flex items-center gap-4 px-2 text-white">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-xs">
                <p className="font-black">4,000+ Kids</p>
                <p className="text-slate-500 font-bold">Building already</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, rotate: 5, y: 20 }}
          animate={{ opacity: 1, rotate: -2, y: 0 }}
          className="relative px-12 lg:px-0"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-indigo-600 rounded-[48px] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-slate-900 p-3 rounded-[40px] border border-slate-800 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop" 
                alt="AI Galaxy" 
                className="rounded-[32px] w-full aspect-[4/5] lg:aspect-square object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Achievement Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-12 -right-8 glass-card p-6 rounded-3xl shadow-2xl border-white/10"
              >
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy size={40} className="text-slate-900" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Stats / Proof */}
      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-xl py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 grid sm:grid-cols-3 gap-12 text-slate-100">
          {[
            { icon: Shield, title: "Safe Enclave", desc: "Moderated AI guards for kid-friendly exploration." },
            { icon: Zap, title: "Superpower Tools", desc: "Access the same AI tech used in Silicon Valley." },
            { icon: Trophy, title: "Creator Rank", desc: "Earn certificates recognized by top schools." }
          ].map((feat, i) => (
            <div key={i} className="flex gap-5">
              <div className="bg-indigo-500/10 p-4 rounded-2xl h-fit border border-indigo-500/20">
                <feat.icon className="text-cyan-400" size={32} />
              </div>
              <div>
                <h3 className="font-black text-white text-lg tracking-tight mb-1 font-display">{feat.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};
