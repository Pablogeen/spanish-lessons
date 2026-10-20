'use client';

import React from 'react';
import { BookOpen, MessageSquare, Trophy, Mic2 } from 'lucide-react';

export type TabType = 'journey' | 'chat' | 'duel' | 'pronounce';

interface BottomDockProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  accentColor: 'amber' | 'rose' | 'emerald' | 'cyan';
}

export const BottomDock: React.FC<BottomDockProps> = ({
  currentTab,
  onSelectTab,
  accentColor,
}) => {
  const isRose = accentColor === 'rose';

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    {
      id: 'journey',
      label: 'Lesson',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'chat',
      label: 'AI Coach',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'duel',
      label: 'Scores',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: 'pronounce',
      label: 'Sounds',
      icon: <Mic2 className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3">
      <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-neutral-900/90 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-300 active:scale-90 select-none ${
                isActive
                  ? isRose
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="text-xs font-bold tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};