'use client';

import React, { useState } from 'react';
import { X, Check, Award, Flame, MessageSquare, PenTool } from 'lucide-react';
import { UserId, UserProfile } from '@/lib/types';

interface ProfileSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Record<UserId, UserProfile>;
  activeUserId: UserId;
  onSelectUser: (id: UserId) => void;
  onUpdateName: (id: UserId, newName: string) => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  isOpen,
  onClose,
  profiles,
  activeUserId,
  onSelectUser,
  onUpdateName,
}) => {
  const [editingId, setEditingId] = useState<UserId | null>(null);
  const [tempName, setTempName] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (id: UserId, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setTempName(currentName);
  };

  const handleSaveName = (id: UserId, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tempName.trim()) {
      onUpdateName(id, tempName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-neutral-900 border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl space-y-6 transform transition-transform"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Header with pill handle for mobile sheet feel */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-1.5 rounded-full bg-neutral-700 sm:hidden mb-2" />
          <div className="w-full flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Who is practicing?</h2>
              <p className="text-xs text-neutral-400">Switch profile or customize your duo details</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white border border-white/5 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Selection Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          {(['user1', 'user2'] as UserId[]).map((uid) => {
            const profile = profiles[uid];
            const isSelected = activeUserId === uid;
            const isRose = profile.accentColor === 'rose';

            return (
              <div
                key={uid}
                onClick={() => {
                  onSelectUser(uid);
                  onClose();
                }}
                className={`relative group cursor-pointer rounded-3xl p-4 border transition-all duration-300 active:scale-95 flex flex-col items-center text-center ${
                  isSelected
                    ? isRose
                      ? 'bg-rose-950/40 border-rose-500/70 shadow-lg shadow-rose-950/50 ring-2 ring-rose-500/30'
                      : 'bg-amber-950/40 border-amber-500/70 shadow-lg shadow-amber-950/50 ring-2 ring-amber-500/30'
                    : 'bg-neutral-800/40 border-white/5 hover:border-white/15'
                }`}
              >
                {/* Active check badge */}
                {isSelected && (
                  <div className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                    isRose ? 'bg-rose-500' : 'bg-amber-500'
                  }`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner ${
                  isRose ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {profile.avatar}
                </div>

                {/* Name & Edit */}
                {editingId === uid ? (
                  <div className="flex items-center gap-1 my-1 w-full" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full bg-neutral-800 border border-white/20 rounded-lg px-2 py-0.5 text-xs text-white"
                      autoFocus
                    />
                    <button
                      onClick={(e) => handleSaveName(uid, e)}
                      className="p-1 rounded bg-amber-500 text-black text-xs font-bold"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 w-full">
                    <span className="font-bold text-sm text-white truncate max-w-[90px]">
                      {profile.name}
                    </span>
                    <button
                      onClick={(e) => handleStartEdit(uid, profile.name, e)}
                      className="text-[10px] text-neutral-500 hover:text-neutral-300"
                    >
                      <PenTool className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}

                <span className="text-[11px] text-neutral-400 font-medium">
                  Level {profile.level} Learner
                </span>

                {/* Stats row */}
                <div className="mt-3 pt-3 border-t border-white/5 w-full flex items-center justify-around text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Award className="w-3 h-3" />
                    <span>{profile.xp}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400 font-semibold">
                    <Flame className="w-3 h-3" />
                    <span>{profile.streak}d</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic couple tip */}
        <div className="rounded-2xl bg-neutral-800/60 border border-white/5 p-3.5 text-xs text-neutral-300 flex items-start gap-3">
          <span className="text-xl select-none">💬</span>
          <div>
            <p className="font-semibold text-white">Separate phones, shared journey</p>
            <p className="text-neutral-400 mt-0.5">
              Each of you tracks personal speaking history, while sharing the live duel scoreboard and activity feed.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};