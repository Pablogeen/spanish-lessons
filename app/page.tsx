'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { BottomDock, TabType } from '@/components/BottomDock';
import { ProfileSwitcher } from '@/components/ProfileSwitcher';
import { SettingsModal } from '@/components/SettingsModal';
import { DayJourney } from '@/components/DayJourney';
import { ChatRoom } from '@/components/ChatRoom';
import { CoupleDuel } from '@/components/CoupleDuel';
import { PronunciationGuide } from '@/components/PronunciationGuide';
import { UserId, UserProfile } from '@/lib/types';
import { getActiveUserId, getProfiles, setActiveUserId, updateProfile } from '@/lib/storage';
import { AppTheme, THEMES, getStoredTheme } from '@/lib/settings';

export default function Home() {
  const [activeUserId, setActiveId] = useState<UserId>('user1');
  const [profiles, setProfiles] = useState<Record<UserId, UserProfile> | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('journey');
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('midnight');

  useEffect(() => {
    const id = getActiveUserId();
    setActiveId(id);
    setProfiles(getProfiles());
    setCurrentTheme(getStoredTheme());
  }, []);

  const refreshProfiles = () => {
    setProfiles(getProfiles());
  };

  const handleSelectUser = (id: UserId) => {
    setActiveId(id);
    setActiveUserId(id);
    setProfiles(getProfiles());
  };

  const handleUpdateName = (id: UserId, newName: string) => {
    updateProfile(id, { name: newName });
    refreshProfiles();
  };

  if (!profiles) {
    return (
      <div className="h-dvh flex items-center justify-center bg-neutral-950 text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-semibold">Cargando tu lección...</span>
        </div>
      </div>
    );
  }

  const activeProfile = profiles[activeUserId] || profiles.user1;
  const themeConfig = THEMES[currentTheme] || THEMES.midnight;

  return (
    <main className={`min-h-dvh flex flex-col transition-colors duration-300 ${themeConfig.bgClass} selection:bg-amber-500 selection:text-black`}>
      
      {/* Sleek Top Navbar */}
      <Navbar
        activeProfile={activeProfile}
        onOpenProfileSwitcher={() => setIsSwitcherOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Screen Content */}
      <div className="flex-1 w-full relative">
        {currentTab === 'journey' && (
          <DayJourney
            activeProfile={activeProfile}
            onProfileUpdated={refreshProfiles}
          />
        )}

        {currentTab === 'chat' && (
          <ChatRoom
            activeProfile={activeProfile}
            onXpEarned={refreshProfiles}
          />
        )}

        {currentTab === 'duel' && (
          <CoupleDuel
            activeProfile={activeProfile}
          />
        )}

        {currentTab === 'pronounce' && (
          <PronunciationGuide />
        )}
      </div>

      {/* Flagship Floating Dock Navigation */}
      <BottomDock
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        accentColor={activeProfile.accentColor}
      />

      {/* Profile Switcher Bottom Sheet */}
      <ProfileSwitcher
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
        profiles={profiles}
        activeUserId={activeUserId}
        onSelectUser={handleSelectUser}
        onUpdateName={handleUpdateName}
      />

      {/* Settings Modal (Themes & Gemini Key) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        onThemeChanged={setCurrentTheme}
      />

    </main>
  );
}