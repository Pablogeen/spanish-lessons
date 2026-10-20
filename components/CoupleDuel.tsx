'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, Flame, Sparkles, Swords, Clock, CheckCircle2, 
  Award, Heart, Calendar
} from 'lucide-react';
import { ActivityItem, UserId, UserProfile } from '@/lib/types';
import { getCoupleActivities, getProfiles } from '@/lib/storage';

interface CoupleDuelProps {
  activeProfile: UserProfile;
}

export const CoupleDuel: React.FC<CoupleDuelProps> = ({ activeProfile }) => {
  const [profiles, setProfiles] = useState<Record<UserId, UserProfile>>({
    user1: activeProfile,
    user2: activeProfile,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    setProfiles(getProfiles());
    setActivities(getCoupleActivities());
  }, [activeProfile]);

  const p1 = profiles.user1;
  const p2 = profiles.user2;

  const totalXp = Math.max((p1.xp || 0) + (p2.xp || 0), 1);
  const p1Percent = Math.round(((p1.xp || 0) / totalXp) * 100);
  const p2Percent = 100 - p1Percent;

  const leader = (p1.xp || 0) > (p2.xp || 0) ? p1 : (p2.xp || 0) > (p1.xp || 0) ? p2 : null;

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto px-4 pb-28 pt-2 space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Couple Progress</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> Duo Mode
            </span>
          </h2>
          <p className="text-xs text-neutral-400">Track your daily improvement and friendly scores</p>
        </div>
      </div>

      {/* Head-to-Head Cards */}
      <div className="rounded-3xl bg-neutral-900/90 border border-white/10 p-5 shadow-2xl backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-amber-400" /> Scoreboard
          </span>
          {leader && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>{leader.name.split(' ')[0]} in the lead!</span>
            </div>
          )}
        </div>

        {/* Players */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* User 1 */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            leader?.id === 'user1' ? 'bg-amber-950/30 border-amber-500/40' : 'bg-neutral-800/40 border-white/5'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl">{p1.avatar}</span>
              <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                <Flame className="w-3 h-3 fill-orange-500" />
                <span>{p1.streak}d</span>
              </div>
            </div>
            <h4 className="font-bold text-sm text-white truncate">{p1.name}</h4>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Progress:</span>
                <span className="font-bold text-amber-300">Day {p1.currentDay || 1}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Mastery:</span>
                <span className="font-bold text-emerald-400">{p1.masteryScore || 85}%</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Total XP:</span>
                <span className="font-black text-amber-400">{p1.xp}</span>
              </div>
            </div>
          </div>

          {/* User 2 */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            leader?.id === 'user2' ? 'bg-rose-950/30 border-rose-500/40' : 'bg-neutral-800/40 border-white/5'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl">{p2.avatar}</span>
              <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                <Flame className="w-3 h-3 fill-orange-500" />
                <span>{p2.streak}d</span>
              </div>
            </div>
            <h4 className="font-bold text-sm text-white truncate">{p2.name}</h4>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Progress:</span>
                <span className="font-bold text-rose-300">Day {p2.currentDay || 1}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Mastery:</span>
                <span className="font-bold text-emerald-400">{p2.masteryScore || 85}%</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Total XP:</span>
                <span className="font-black text-rose-400">{p2.xp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="pt-2 border-t border-white/5">
          <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${p1Percent}%` }} />
            <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${p2Percent}%` }} />
          </div>
        </div>
      </div>

      {/* Shared Activity Feed */}
      <div className="rounded-3xl bg-neutral-900/90 border border-white/10 p-4 shadow-xl backdrop-blur-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" /> Duo Improvement Log
          </h3>
          <span className="text-[11px] text-neutral-400">Recent</span>
        </div>

        <div className="space-y-2">
          {activities.map((act) => (
            <div 
              key={act.id} 
              className="p-2.5 rounded-2xl bg-neutral-800/40 border border-white/5 flex items-start gap-2.5 text-xs"
            >
              <div className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-xs shrink-0">
                {act.userName === 'Ella' ? '👑' : '🦁'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{act.userName}</span>
                  <span className="text-[10px] text-amber-400 font-bold">+{act.xpEarned} XP</span>
                </div>
                <p className="text-neutral-300 mt-0.5">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};