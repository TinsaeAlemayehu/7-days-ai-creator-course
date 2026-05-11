import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, CheckCircle2, XCircle, MessageCircle } from 'lucide-react';
import { LessonStep, Mentor } from '../constants';
import { getMentorResponse } from '../lib/gemini';

interface LessonViewProps {
  mentor: Mentor;
  steps: LessonStep[];
  onComplete: () => void;
  onExit: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ mentor, steps, onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mentorChat, setMentorChat] = useState<string>('');
  const [loadingChat, setLoadingChat] = useState(false);

  const step = steps[currentStep];

  useEffect(() => {
    // Initial mentor greeting
    const greet = async () => {
      setLoadingChat(true);
      const res = await getMentorResponse(mentor.name, mentor.personality, "Say hello to a new creator start their first lesson!");
      setMentorChat(res || "Let's go! 🚀");
      setLoadingChat(false);
    };
    greet();
  }, [mentor]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      onComplete();
    }
  };

  const handleCheck = () => {
    if (step.type === 'quiz' && selectedOption) {
      const correct = selectedOption === step.correctAnswer;
      setIsCorrect(correct);
      
      // Get mentor feedback based on performance
      const getFeedback = async () => {
        setLoadingChat(true);
        const prompt = correct ? "They got the answer right! Celebrate!" : "They got it wrong. Give them a funny encouraging hint without telling the answer.";
        const res = await getMentorResponse(mentor.name, mentor.personality, prompt);
        setMentorChat(res || (correct ? "YES! 🌟" : "Wait! Try once more! 🤔"));
        setLoadingChat(false);
      };
      getFeedback();
    } else {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020617] text-white z-50 flex flex-col">
      {/* Progress Header */}
      <div className="p-6 flex items-center gap-4 bg-[#050B18] border-b border-slate-800">
        <button onClick={onExit} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <XCircle size={24} className="text-slate-500 hover:text-red-400" />
        </button>
        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-400 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="font-black text-slate-500 tracking-tighter">{(currentStep + 1).toString().padStart(2, '0')} / {steps.length.toString().padStart(2, '0')}</span>
      </div>

      <main className="flex-1 overflow-y-auto px-8 py-16 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl space-y-16"
          >
            {/* Mentor Bubble */}
            <div className="flex gap-6 items-start">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-20 animate-pulse"></div>
                <div className="relative w-16 h-16 rounded-2xl bg-slate-900 flex-shrink-0 border-2 border-slate-800 overflow-hidden shadow-xl">
                  <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover p-2" />
                </div>
              </div>
              <div className="bg-slate-800/80 p-5 rounded-2xl rounded-tl-none border border-slate-700 relative max-w-[80%] shadow-2xl backdrop-blur-md">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-slate-800 border-l border-t border-slate-700 rotate-[-45deg]" />
                <p className="text-slate-200 font-bold text-sm leading-relaxed tracking-tight">
                  {loadingChat ? "Scanning patterns..." : mentorChat}
                </p>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-10">
              <h2 className="text-4xl font-black text-white leading-tight tracking-tighter">
                {step.content}
              </h2>

              {step.type === 'quiz' && step.options && (
                <div className="grid gap-4">
                  {step.options.map((opt) => (
                    <button
                      key={opt}
                      disabled={isCorrect !== null}
                      onClick={() => setSelectedOption(opt)}
                      className={`
                        w-full p-6 rounded-2xl border-2 text-left font-black text-xl transition-all backdrop-blur-md
                        ${selectedOption === opt ? 
                          (isCorrect === true ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' :
                           isCorrect === false ? 'bg-red-500/10 border-red-500 text-red-400' :
                           'bg-indigo-600/20 border-indigo-500 text-indigo-400') : 
                          'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        {opt}
                        {selectedOption === opt && isCorrect === true && <CheckCircle2 className="text-cyan-400" />}
                        {selectedOption === opt && isCorrect === false && <XCircle className="text-red-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      <footer className="p-8 border-t border-slate-800 bg-[#050B18]">
        <div className="max-w-2xl mx-auto flex justify-end">
          {step.type === 'quiz' && isCorrect === null ? (
            <button
              disabled={!selectedOption}
              onClick={handleCheck}
              className={`
                px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-2 transition-all shadow-2xl
                ${selectedOption ? 'bg-white text-slate-900 shadow-white/5 saturate-150' : 'bg-slate-900 text-slate-700 cursor-not-allowed'}
              `}
            >
              Analyze Input
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-12 py-5 bg-cyan-500 text-slate-900 rounded-2xl font-black text-xl flex items-center gap-3 shadow-2xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              Next Step
              <ArrowRight size={24} strokeWidth={3} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
