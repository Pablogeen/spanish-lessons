'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Key, Palette, Sparkles, Check, ExternalLink, HelpCircle, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppTheme, THEMES, getStoredTheme, setStoredTheme, getClientApiKey, setClientApiKey } from '@/lib/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onThemeChanged: (theme: AppTheme) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChanged,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected?: boolean;
    message?: string;
    model?: string;
  } | null>(null);

  const testKey = useCallback(async (keyToTest: string) => {
    if (!keyToTest || !keyToTest.trim()) return;
    setIsTesting(true);
    setConnectionStatus(null);
    try {
      const res = await fetch('/api/test-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyToTest.trim() }),
      });
      const data = await res.json();
      setConnectionStatus(data);
    } catch (err: any) {
      setConnectionStatus({ connected: false, message: 'Could not connect to server' });
    } finally {
      setIsTesting(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const saved = getClientApiKey();
      setApiKey(saved);
      if (saved) {
        testKey(saved);
      }
    }
  }, [isOpen, testKey]);

  if (!isOpen) return null;

  const handleSaveAndTest = () => {
    setClientApiKey(apiKey);
    testKey(apiKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-neutral-900 border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl space-y-5"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">App Settings & Themes</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Selector */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Choose Your Theme:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(THEMES) as AppTheme[]).map((themeKey) => {
              const th = THEMES[themeKey];
              const isSelected = currentTheme === themeKey;

              return (
                <button
                  key={themeKey}
                  onClick={() => {
                    setStoredTheme(themeKey);
                    onThemeChanged(themeKey);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                      : 'bg-neutral-800/60 border-white/5 text-neutral-300 hover:border-white/15'
                  }`}
                >
                  <span className="text-xl">{th.emoji}</span>
                  <div className="leading-tight">
                    <p className="text-xs font-bold">{th.name}</p>
                    {isSelected && (
                      <span className="text-[10px] text-amber-400 font-semibold">Active</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Google Gemini API Key Section with Live Test */}
        <div className="space-y-2.5 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" /> Google Gemini API Key
            </span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste AIzaSy... here"
              className="flex-1 bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-400 font-mono"
            />
            <button
              onClick={handleSaveAndTest}
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs shadow-md active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <span>Save & Test</span>
              )}
            </button>
          </div>

          {/* Connection Status Badge */}
          {connectionStatus && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in ${
              connectionStatus.connected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}>
              {connectionStatus.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">
                  {connectionStatus.connected 
                    ? '🟢 Google Gemini Connected!' 
                    : '🟡 Connection Check Failed'}
                </p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {connectionStatus.message || (connectionStatus as any).error}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Live Conversation Guide */}
        <div className="rounded-2xl bg-neutral-800/60 border border-white/5 p-3.5 space-y-1 text-xs text-neutral-300">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Live AI Coach
          </p>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Switch to the <strong>AI Coach</strong> tab on the bottom dock to have an open, back-and-forth conversation in Madrid Spanish anytime!
          </p>
        </div>

      </div>
    </div>
  );
};