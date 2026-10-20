'use client';

import React from 'react';

interface AudioWaveProps {
  isActive: boolean;
  color?: string;
}

export const AudioWave: React.FC<AudioWaveProps> = ({ isActive, color = 'bg-amber-400' }) => {
  if (!isActive) return null;

  return (
    <div className="flex items-center gap-1 h-5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
      <span className={`w-1 rounded-full ${color} animate-wave-1 h-2`} />
      <span className={`w-1 rounded-full ${color} animate-wave-2 h-4`} />
      <span className={`w-1 rounded-full ${color} animate-wave-3 h-3`} />
      <span className={`w-1 rounded-full ${color} animate-wave-2 h-5`} />
      <span className={`w-1 rounded-full ${color} animate-wave-1 h-2.5`} />
    </div>
  );
};