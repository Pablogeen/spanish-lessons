'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, Check } from 'lucide-react';
import { PRONUNCIATION_GUIDES } from '@/lib/pronunciation';
import { speakCastilian } from '@/lib/audio';

export const PronunciationGuide: React.FC = () => {
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const handlePlay = (word: string) => {
    setPlayingWord(word);
    speakCastilian(
      word,
      () => setPlayingWord(word),
      () => setPlayingWord(null),
      0.85 // Slightly slower for clear phonetic listening
    );
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto px-4 pb-28 pt-2 space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <span>Castilian Phonetics</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            Spain Accent
          </span>
        </h2>
        <p className="text-xs text-neutral-400">Master the iconic sounds of España with audio samples</p>
      </div>

      {/* Guide Cards */}
      <div className="space-y-4">
        {PRONUNCIATION_GUIDES.map((guide) => (
          <div
            key={guide.id}
            className="rounded-3xl bg-neutral-900/90 border border-white/10 p-5 shadow-2xl backdrop-blur-2xl space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {guide.letterOrSound}
                </h3>
                <span className="text-[11px] font-semibold text-amber-400">
                  {guide.ipaSound}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 font-medium">
                {guide.castilianName}
              </span>
            </div>

            {/* Instruction description */}
            <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-800/40 p-3 rounded-2xl border border-white/5">
              {guide.howToMakeSound}
            </p>

            {/* Example Words Grid with Audio */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Listen & Repeat:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {guide.exampleWords.map((ex, idx) => {
                  const isPlaying = playingWord === ex.word;
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePlay(ex.word)}
                      className={`p-2.5 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                        isPlaying
                          ? 'bg-amber-500/20 border-amber-500/60 shadow-md'
                          : 'bg-neutral-800/60 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-sm text-white">{ex.word}</span>
                        <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-neutral-400'}`} />
                      </div>
                      <span className="text-[11px] text-amber-300/80 font-mono mt-0.5">{ex.syllables}</span>
                      <span className="text-[10px] text-neutral-400 truncate mt-1">{ex.meaning}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};