import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, Sparkles, Download, Share2, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Mentor } from '../constants';

interface ProjectLabProps {
  mentor: Mentor;
  onComplete: (projectData: any) => void;
  onExit: () => void;
}

export const ProjectLab: React.FC<ProjectLabProps> = ({ mentor, onComplete, onExit }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    
    // Simulate Image Generation for demo (would use actual generateContent with image model in real app)
    // Using a high-quality placeholder for immediate feedback
    setTimeout(() => {
      setGeneratedImage(`https://picsum.photos/seed/${prompt}/800/800`);
      setIsGenerating(false);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#4f46e5', '#ffffff']
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#020617] z-50 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar Tool */}
      <div className="w-full md:w-[450px] bg-[#050B18] border-r border-slate-800 p-10 flex flex-col gap-10 overflow-y-auto z-10">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-cyan-400 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-cyan-500/20">
              <Wand2 size={24} className="text-white" />
            </div>
            <h1 className="font-black text-2xl text-white tracking-tight uppercase">Mascot Creator</h1>
          </div>
          <button onClick={onExit} className="text-slate-600 hover:text-white font-black text-xs uppercase tracking-widest">Exit</button>
        </header>

        <div className="space-y-8">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex gap-4 backdrop-blur-md text-white">
             <div className="w-12 h-12 bg-slate-800 rounded-xl flex-shrink-0 border border-slate-700 overflow-hidden">
                <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover p-1" />
             </div>
             <p className="text-slate-300 font-bold text-sm tracking-tight leading-relaxed italic">
                "Time to summon your digital assistant! Write a detailed description of what you envision."
             </p>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-600 px-1">Alchemical Formula (Prompt)</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A cybernetic dragon with glowing scales and a jetpack..."
              className="w-full h-40 p-6 rounded-3xl bg-slate-900 border-2 border-slate-800 focus:border-cyan-400 text-white transition-all outline-none font-bold text-lg resize-none shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Magical', 'Futuristic', 'Anime', 'Oil Painting'].map(style => (
              <button 
                key={style}
                onClick={() => setPrompt(prev => prev ? `${prev}, in ${style} style` : `A character in ${style} style`)}
                className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 text-slate-400 font-bold text-sm hover:bg-slate-800 hover:border-indigo-500 hover:text-white transition-all"
              >
                + {style}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <button 
            disabled={!prompt || isGenerating}
            onClick={handleGenerate}
            className={`
              w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all
              ${prompt && !isGenerating ? 'bg-white text-slate-900 shadow-xl shadow-white/5 hover:bg-cyan-400 active:scale-95' : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800'}
            `}
          >
            {isGenerating ? 'SUMMONING...' : 'CHANNEL MAGIC'}
            <Sparkles size={24} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <main className="flex-1 bg-[#020617] flex flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px] animate-pulse" />
           <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[150px] animate-pulse delay-1000" />
        </div>

        <AnimatePresence mode="wait">
          {!generatedImage && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-6"
            >
              <div className="w-72 h-72 border-2 border-dashed border-slate-800 rounded-[50px] flex items-center justify-center">
                <Sparkles size={80} className="text-slate-800" />
              </div>
              <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Awaiting Signal...</p>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative w-32 h-32 text-white">
                <div className="absolute inset-0 border-8 border-slate-900 rounded-full" />
                <div className="absolute inset-0 border-8 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-white font-black text-3xl tracking-tighter animate-pulse">MATERIALIZING PIXELS...</p>
            </motion.div>
          )}

          {generatedImage && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl flex flex-col gap-10"
            >
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 rounded-[52px] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000" />
                <div className="relative bg-slate-950 p-2 rounded-[48px] border border-white/5 shadow-2xl">
                   <img src={generatedImage} alt="Generated Mascot" className="w-full rounded-[40px] shadow-3xl text-white" />
                </div>
                
                {/* Overlay Controls */}
                <div className="absolute top-10 right-10 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                   <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-2xl hover:bg-white hover:text-slate-900 active:scale-90 transition-all"><Download size={24} /></button>
                   <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-2xl hover:bg-white hover:text-slate-900 active:scale-90 transition-all"><Share2 size={24} /></button>
                   <button onClick={() => setGeneratedImage(null)} className="p-4 bg-red-500 text-white rounded-2xl shadow-2xl hover:bg-red-400 active:scale-90 transition-all"><RotateCcw size={24} /></button>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => onComplete({ prompt, imageUrl: generatedImage })}
                  className="px-16 py-6 bg-cyan-500 text-slate-900 rounded-3xl font-black text-2xl flex items-center gap-4 shadow-3xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-tight"
                >
                  Finalize Mission
                  <ArrowRight size={32} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
