/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { MissionMap } from './components/MissionMap';
import { LessonView } from './components/LessonView';
import { ProjectLab } from './components/ProjectLab';
import { CHALLENGE_DATA, MENTORS } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Zap, Flame, User, Settings, LayoutDashboard, Briefcase, GraduationCap } from 'lucide-react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import confetti from 'canvas-confetti';

function AppContent() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [activeMission, setActiveMission] = useState<number | null>(null);
  const [view, setView] = useState<'landing' | 'map' | 'lesson' | 'lab' | 'parent'>('landing');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-slate-900 rounded-full" />
          <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="font-black text-xs uppercase tracking-[0.4em] animate-pulse">Initializing Portal...</p>
      </div>
    );
  }

  // Handle flow transitions
  const startMission = (day: number) => {
    setActiveMission(day);
    setView('lesson');
  };

  const completeLesson = () => {
    setView('lab');
  };

  const finalizeDay = async (projectData: any) => {
    if (!user || !profile || !activeMission) return;

    const path = `users/${user.uid}`;
    try {
      const userRef = doc(db, 'users', user.uid);
      const mission = CHALLENGE_DATA.find(m => m.day === activeMission);
      
      await updateDoc(userRef, {
        completedDays: arrayUnion(activeMission),
        xp: profile.xp + (mission?.reward.xp || 0),
        badges: arrayUnion(mission?.reward.badgeId),
        lastActive: new Date().toISOString()
      });

      await refreshProfile();
      setView('map');
      setActiveMission(null);
      
      // Grand celebration
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#22d3ee', '#4f46e5', '#ffffff', '#818cf8']
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  if (view === 'landing' && !user) {
    return <LandingPage onStart={() => setView('map')} />;
  }

  const currentMission = CHALLENGE_DATA.find(m => m.day === activeMission);
  const mentor = MENTORS.find(m => m.id === currentMission?.mentorId) || MENTORS[0];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-hidden">
      {/* Sidebar / Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-[#050B18] flex flex-col p-6 hidden lg:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 shadow-lg shadow-cyan-500/20 text-xl font-bold">A</div>
          <span className="text-lg font-bold tracking-tight text-white uppercase">Creator.AI</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setView('map')}
            className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${view === 'map' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Missions</span>
          </button>
          <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
            <Briefcase size={20} />
            <span className="font-medium">Gallery</span>
          </button>
          <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
            <Trophy size={20} />
            <span className="font-medium">Leaderboard</span>
          </button>
        </nav>

        {/* Parent Zone */}
        <div className="mt-auto rounded-2xl bg-gradient-to-tr from-indigo-900/40 to-slate-800/40 p-4 border border-indigo-500/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-2">Parent Zone</p>
          <p className="text-xs text-slate-400 mb-3">{profile?.name.split(' ')[0]} is {Math.round((profile?.completedDays.length || 0) / 7 * 100)}% through the challenge.</p>
          <button className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all">View Progress</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-slate-800 px-8 py-4 bg-[#020617]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <span className="font-bold text-white">{profile?.streaks || 0} Day Streak</span>
            </div>
            
            <div className="flex flex-col justify-center w-48 hidden sm:flex">
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                <span>Level {profile?.level || 1} Creator</span>
                <span>{profile?.xp || 0} XP</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: profile ? `${Math.min((profile.xp / 5000) * 100, 100)}%` : 0 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-100 uppercase tracking-tight">{profile?.name || 'Explorer'}</p>
              <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-black leading-none mt-0.5">
                {profile?.level && profile.level > 2 ? 'AI Sage' : 'Novice Mage'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-indigo-500 p-0.5">
              <div className="h-full w-full rounded-full bg-slate-700 overflow-hidden">
                <img src={profile?.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-10">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {view === 'map' && profile && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="mb-10 relative">
                    <div className="absolute -top-10 -right-20 p-10 opacity-10 pointer-events-none">
                      <svg width="300" height="300" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.2" fill="none"/></svg>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">7-Day AI Challenge</h1>
                    <p className="text-slate-400 font-medium tracking-tight">Complete missions to unlock your AI Superpowers.</p>
                  </div>
                  
                  <MissionMap profile={profile} onMissionSelect={startMission} />
                </motion.div>
              )}

              {view === 'lesson' && currentMission && (
                <LessonView 
                  key="lesson"
                  mentor={mentor}
                  steps={currentMission.steps}
                  onExit={() => setView('map')}
                  onComplete={completeLesson}
                />
              )}

              {view === 'lab' && currentMission && (
                <ProjectLab 
                  key="lab"
                  mentor={mentor}
                  onExit={() => setView('map')}
                  onComplete={finalizeDay}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Right AI Sidebar for context (Mobile/Tablet Hidden) */}
      <aside className="w-72 border-l border-slate-800 bg-[#050B18] p-6 flex flex-col hidden xl:flex">
        <div className="rounded-3xl bg-indigo-500/10 p-6 border border-indigo-500/20 text-center mb-6">
           <div className="relative mx-auto mb-4 h-24 w-24">
             <div className="absolute inset-0 rounded-full bg-cyan-400 blur-xl opacity-20 animate-pulse"></div>
             <div className="relative flex h-full w-full items-center justify-center rounded-full bg-slate-900 border border-cyan-500/50 overflow-hidden">
               <img src={mentor.avatar} alt="Mentor" className="w-full h-full object-cover p-2" />
             </div>
           </div>
           <h4 className="font-black text-white uppercase tracking-wider">{mentor.name}</h4>
           <p className="text-[10px] uppercase tracking-widest text-cyan-400 mb-3 font-bold">{mentor.role}</p>
           <div className="text-xs text-slate-300 leading-relaxed italic px-2">
             "{mentor.personality.split('.')[0]}! Ready for more magic?"
           </div>
        </div>

        <div className="flex-1">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Badges Earned</h5>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`h-16 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-2xl ${profile?.badges.length && profile.badges.length >= i ? '' : 'grayscale opacity-30'}`}>
                {i === 1 ? '✨' : i === 2 ? '🎨' : i === 3 ? '⚡' : '👾'}
              </div>
            ))}
          </div>
        </div>

        <button className="mt-auto flex items-center justify-center space-x-2 rounded-xl bg-cyan-500 py-3 text-sm font-black text-slate-900 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all uppercase tracking-tight">
          <Zap size={16} fill="currentColor" />
          <span>Ask {mentor.name} for Help</span>
        </button>
      </aside>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

