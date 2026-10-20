'use client';

import React from 'react';
import { Flame, Sparkles, RefreshCw, Settings } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface NavbarProps {
  activeProfile: UserProfile;
  onOpenProfileSwitcher: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeProfile,
  onOpenProfileSwitcher,
  onOpenSettings,
}) => {
  const isRose = activeProfile.accentColor === 'rose';

  return (
    <header className="sticky top-0 z-40 w-full pt-[max(0.75rem,env(safe-area-inset-top))] px-4 pb-2">
      <div className="mx-auto max-w-lg rounded-3xl bg-neutral-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl px-4 py-2.5 flex items-center justify-between transition-all duration-300">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-2xl bg-gradient-to-tr from-amber-600 to-red-600 shadow-sm">
            <span className="text-sm select-none">🇪🇸</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold tracking-tight text-white text-sm">HablaDos</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Day {activeProfile.currentDay || 1}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">Ground Zero ➔ Pro</p>
          </div>
        </div>

        {/* Right Stats & Profile */}
        <div className="flex items-center gap-1.5">
          {/* Streak */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span>{activeProfile.streak}d</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeProfile.xp}</span>
          </div>

          {/* Switch Profile Button */}
          <button
            onClick={onOpenProfileSwitcher}
            className={`flex items-center gap-1 pl-1.5 pr-2 py-1 rounded-2xl border transition-all active:scale-95 ${
              isRose
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-200'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-200'
            }`}
          >
            <span className="text-xs select-none">{activeProfile.avatar}</span>
            <span className="text-xs font-semibold max-w-[55px] truncate">
              {activeProfile.name.split(' ')[0]}
            </span>
            <RefreshCw className="w-2.5 h-2.5 opacity-60" />
          </button>

          {/* Settings Trigger (Theme & AI Key) */}
          <button
            onClick={onOpenSettings}
            className="w-7 h-7 rounded-2xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white active:scale-90"
            title="Themes & Gemini API Key Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};