import React from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Star, ChevronRight } from 'lucide-react';
import { CHALLENGE_DATA } from '../constants';
import { UserProfile } from '../types';

interface MissionMapProps {
  profile: UserProfile;
  onMissionSelect: (day: number) => void;
}

export const MissionMap: React.FC<MissionMapProps> = ({ profile, onMissionSelect }) => {
  return (
    <div className="flex flex-col items-center gap-12 py-12 relative overflow-visible">
      {/* Visual Path Line */}
      <div className="absolute top-0 bottom-0 w-1 border-l-2 border-dashed border-slate-700 left-1/2 -ml-0.5 hidden md:block" />

      {CHALLENGE_DATA.map((mission, index) => {
        const isLocked = mission.day > profile.completedDays.length + 1;
        const isCompleted = profile.completedDays.includes(mission.day);
        const isActive = mission.day === profile.completedDays.length + 1;

        return (
          <motion.div
            key={mission.day}
            whileHover={!isLocked ? { scale: 1.02, x: index % 2 === 0 ? 10 : -10 } : {}}
            whileTap={!isLocked ? { scale: 0.98 } : {}}
            className={`relative z-10 w-full cursor-pointer transition-all ${isLocked ? 'opacity-40 grayscale' : ''}`}
            onClick={() => !isLocked && onMissionSelect(mission.day)}
          >
            <div className={`
              group flex items-center gap-6 p-6 rounded-2xl border-2 transition-all backdrop-blur-md
              ${isActive ? 'bg-slate-800/80 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.2)]' : 
                isCompleted ? 'bg-slate-800/40 border-slate-700 opacity-60' : 
                'bg-slate-900/50 border-slate-800'}
              ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse text-right'}
            `}>
              <div className={`
                flex h-20 w-20 items-center justify-center rounded-2xl text-white border-2 flex-shrink-0
                ${isActive ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.5)] ring-4 ring-indigo-400/10 rotate-3' : 
                  isCompleted ? 'bg-slate-700 border-slate-600' : 
                  'bg-slate-800 border-slate-700'}
              `}>
                {isCompleted ? <Check size={40} className="text-cyan-400" /> :
                 isLocked ? <Lock size={32} className="text-slate-600" /> :
                 <span className="text-2xl font-black italic">{mission.day.toString().padStart(2, '0')}</span>}
              </div>

              <div className="flex-1">
                <div className={`flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {index % 2 !== 0 && <span className="text-xs font-black uppercase tracking-widest text-slate-500">Day {mission.day}</span>}
                    <Star size={14} className={isActive ? 'text-indigo-400' : 'text-slate-600'} fill="currentColor" />
                    {index % 2 === 0 && <span className="text-xs font-black uppercase tracking-widest text-slate-500">Day {mission.day}</span>}
                  </div>
                  <h3 className={`text-xl font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {mission.title}
                  </h3>
                  <p className={`text-sm font-medium ${isActive ? 'text-slate-400' : 'text-slate-600'}`}>
                    {mission.goal}
                  </p>
                </div>
                
                {isActive && (
                  <button className={`mt-4 rounded-lg bg-white px-6 py-2 text-[10px] font-black text-slate-900 transition hover:bg-cyan-400 uppercase tracking-widest`}>
                    RESUME MISSION
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
