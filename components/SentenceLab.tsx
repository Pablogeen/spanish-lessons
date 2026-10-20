'use client';

import React, { useState, useRef } from 'react';
import { 
  Sparkles, Mic, MicOff, Volume2, Award, ArrowRight, CheckCircle2, 
  Lightbulb, RefreshCw, Flame, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SentenceEvaluation, UserProfile } from '@/lib/types';
import { speakCastilian, startListening, isSpeechRecognitionSupported } from '@/lib/audio';
import { awardXp } from '@/lib/storage';

interface SentenceLabProps {
  activeProfile: UserProfile;
  onXpEarned: () => void;
}

const INSPIRATION_PROMPTS = [
  'Tengo muchas ganas de ir a España.',
  '¿Nos tomamos unas cañas esta tarde?',
  'Hoy hace un día estupendo en la ciudad.',
  '¿A qué hora sale el tren para Sevilla?',
  'Mi amor, eres lo más bonito de mi vida.'
];

export const SentenceLab: React.FC<SentenceLabProps> = ({ activeProfile, onXpEarned }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<SentenceEvaluation | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const handleToggleMic = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    setIsRecording(true);
    recognitionRef.current = startListening(
      (transcript) => {
        setInputText(transcript);
        setIsRecording(false);
      },
      (err) => {
        console.error('Mic error:', err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );
  };

  const handleEvaluate = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/sentence-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: text, userId: activeProfile.id }),
      });

      const data: SentenceEvaluation = await res.json();
      data.id = 'eval-' + Date.now();
      data.userId = activeProfile.id;
      data.originalText = text;
      data.timestamp = Date.now();

      setEvaluation(data);

      // Trigger celebratory confetti if score is high!
      if (data.score >= 80) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ef4444', '#10b981', '#ffffff'],
        });
      }

      // Award XP
      awardXp(
        activeProfile.id, 
        data.xpAwarded || 30, 
        `Mastered sentence in Spain Spanish: "${data.naturalCastilian.slice(0, 30)}..."`, 
        'sentence'
      );
      onXpEarned();

    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = (text: string) => {
    setIsPlayingAudio(true);
    speakCastilian(
      text,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto px-4 pb-28 pt-2 space-y-4">
      
      {/* Title & Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Sentence Lab</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Free Expression
            </span>
          </h2>
          <p className="text-xs text-neutral-400">Write or speak any Spanish sentence for instant Castilian feedback</p>
        </div>
      </div>

      {/* Quick Inspiration Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {INSPIRATION_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-neutral-900/80 border border-white/5 text-neutral-300 hover:text-white whitespace-nowrap active:scale-95 transition-all"
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Input Box Card */}
      <div className="rounded-3xl bg-neutral-900/90 border border-white/10 p-4 shadow-2xl backdrop-blur-xl relative">
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe aquí cualquier frase en español (o pulsa el micrófono para dictar)..."
          className="w-full bg-transparent border-none outline-none text-white placeholder-neutral-500 text-base resize-none"
        />

        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
          {/* Mic Button */}
          <button
            onClick={handleToggleMic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isRecording ? 'Listening...' : 'Dictate with Mic'}</span>
          </button>

          {/* Evaluate Button */}
          <button
            onClick={handleEvaluate}
            disabled={!inputText.trim() || isLoading}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-95 ${
              inputText.trim() && !isLoading
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-md shadow-amber-500/30'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evaluate & Score</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="rounded-3xl bg-neutral-900/95 border border-amber-500/30 p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 backdrop-blur-2xl">
          
          {/* Header Score & XP */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* Circular Score Badge */}
              <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shadow-lg ${
                evaluation.score >= 85 
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
                  : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
              }`}>
                <span className="text-lg leading-none">{evaluation.score}</span>
                <span className="text-[9px] uppercase font-bold opacity-75">Score</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">Castilian Analysis</h3>
                <p className="text-xs text-neutral-400">{evaluation.feedback}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>+{evaluation.xpAwarded} XP</span>
            </div>
          </div>

          {/* Natural Castilian Rewrite Card */}
          <div className="rounded-2xl bg-neutral-800/80 border border-white/5 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <span>🇪🇸</span> How locals say it in Spain:
              </span>
              <button
                onClick={() => handlePlayAudio(evaluation.naturalCastilian)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                  isPlayingAudio
                    ? 'bg-amber-400 text-neutral-950 font-bold'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? 'Playing...' : 'Pronounce'}</span>
              </button>
            </div>
            <p className="text-base font-semibold text-white tracking-tight">
              "{evaluation.naturalCastilian}"
            </p>
          </div>

          {/* Corrections Breakdown */}
          {evaluation.corrections && evaluation.corrections.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Grammar & Dialect Tweaks:
              </span>
              {evaluation.corrections.map((corr, idx) => (
                <div key={idx} className="rounded-xl bg-black/40 border border-white/5 p-2.5 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="text-red-400 line-through">{corr.original}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-500" />
                    <span className="text-emerald-400 font-bold">{corr.improved}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px]">{corr.why}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pronunciation Tip */}
          {evaluation.pronunciationTip && (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Phonetic Tip: </span>
                <span>{evaluation.pronunciationTip}</span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};