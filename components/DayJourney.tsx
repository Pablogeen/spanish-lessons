'use client';

import React, { useState, useEffect } from 'react';
import { 
  Volume2, Mic, MicOff, CheckCircle2, ArrowRight, Award, 
  Trophy, Sparkles, Check, ChevronRight, Eye, EyeOff, AlertCircle, PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DAY_CURRICULUM, DailyLesson, LessonStage } from '@/lib/curriculum';
import { UserProfile } from '@/lib/types';
import { speakCastilian, stopSpeaking, startListening, isSpeechRecognitionSupported } from '@/lib/audio';
import { advanceDay, awardXp } from '@/lib/storage';
import { verifySpanishAnswer, VerificationResult } from '@/lib/verifier';

interface DayJourneyProps {
  activeProfile: UserProfile;
  onProfileUpdated: () => void;
}

export const DayJourney: React.FC<DayJourneyProps> = ({ activeProfile, onProfileUpdated }) => {
  const currentDayNum = activeProfile.currentDay || 1;
  const currentLesson: DailyLesson = 
    DAY_CURRICULUM.find((l) => l.day === currentDayNum) || DAY_CURRICULUM[0];

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  
  // Dual verification states for the active step
  const [isSpokenVerified, setIsSpokenVerified] = useState(false);
  const [isWrittenVerified, setIsWrittenVerified] = useState(false);
  
  const [spokenFeedback, setSpokenFeedback] = useState<VerificationResult | null>(null);
  const [writtenFeedback, setWrittenFeedback] = useState<VerificationResult | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [writtenInput, setWrittenInput] = useState('');
  const [isDayFinished, setIsDayFinished] = useState(false);

  // Reset steps when day changes
  useEffect(() => {
    setActiveStepIndex(0);
    setIsTestMode(false);
    setCompletedSteps({});
    resetStepVerification();
    setIsDayFinished(false);
  }, [currentDayNum]);

  // Reset verification state when switching step index
  useEffect(() => {
    setIsTestMode(false);
    resetStepVerification();
  }, [activeStepIndex]);

  const resetStepVerification = () => {
    setIsSpokenVerified(false);
    setIsWrittenVerified(false);
    setSpokenFeedback(null);
    setWrittenFeedback(null);
    setSpokenText('');
    setWrittenInput('');
  };

  const currentStage: LessonStage = currentLesson.stages[activeStepIndex] || currentLesson.stages[0];

  const handlePlayAudio = (text: string) => {
    stopSpeaking();
    setIsSpeaking(true);
    speakCastilian(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      0.88
    );
  };

  // 1. Microphone Speaking Check
  const handleToggleMic = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert('Microphone speech recognition is not supported in this browser.');
      return;
    }

    setIsRecording(true);
    setSpokenFeedback(null);
    startListening(
      (transcript) => {
        setSpokenText(transcript);
        setIsRecording(false);
        verifySpeech(transcript);
      },
      (err) => {
        console.error('Mic error:', err);
        setIsRecording(false);
      },
      () => setIsRecording(false)
    );
  };

  const verifySpeech = (speechText: string) => {
    const result = verifySpanishAnswer(speechText, currentStage.phrase);
    setSpokenFeedback(result);

    if (result.isCorrect) {
      setIsSpokenVerified(true);
    }
  };

  // 2. Written Spelling Check
  const verifyWriting = () => {
    const text = writtenInput.trim();
    if (!text) return;

    const result = verifySpanishAnswer(text, currentStage.phrase);
    setWrittenFeedback(result);

    if (result.isCorrect) {
      setIsWrittenVerified(true);
      setCompletedSteps((prev) => ({ ...prev, [activeStepIndex]: true }));
      awardXp(activeProfile.id, 30, `Mastered speaking & writing: "${currentStage.phrase}"`, 'sentence');
      onProfileUpdated();

      // Check if last step in day
      if (activeStepIndex === currentLesson.stages.length - 1) {
        setIsDayFinished(true);
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ffffff'],
        });
      }
    }
  };

  const handleNextStep = () => {
    if (activeStepIndex < currentLesson.stages.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  const handleAdvanceToNextDay = () => {
    advanceDay(activeProfile.id);
    onProfileUpdated();
  };

  const isStepFullyMastered = isSpokenVerified && isWrittenVerified;

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto px-4 pb-28 pt-2 space-y-4">
      
      {/* Top Header Card with Stepper */}
      <div className="rounded-3xl bg-neutral-900/90 border border-white/10 p-4 shadow-xl backdrop-blur-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Day {currentLesson.day}
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              {currentLesson.level}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>Mastery: {activeProfile.masteryScore || 85}%</span>
          </div>
        </div>

        <div>
          <h2 className="text-base font-black text-white tracking-tight">
            {currentLesson.title}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">{currentLesson.theme}</p>
        </div>

        {/* 4-Step Stepper Navigation */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {currentLesson.stages.map((stg, idx) => {
            const isDone = !!completedSteps[idx];
            const isCurrent = activeStepIndex === idx;

            return (
              <button
                key={stg.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`py-1.5 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center border text-[11px] font-bold ${
                  isCurrent
                    ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : isDone
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-neutral-800/60 border-white/5 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-0.5">
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>Step {stg.step}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Learning Card */}
      <div className="rounded-3xl bg-neutral-900/90 border border-white/10 p-5 shadow-2xl backdrop-blur-2xl space-y-4">
        
        {/* Step Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {currentStage.label}
          </span>

          {!isTestMode ? (
            <button
              onClick={() => handlePlayAudio(currentStage.phrase)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all active:scale-95 ${
                isSpeaking
                  ? 'bg-amber-400 text-neutral-950 shadow-md'
                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeaking ? 'Playing...' : 'Listen Audio'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsTestMode(false)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Peek & Re-study</span>
            </button>
          )}
        </div>

        {/* Phase A: Study View (Read & Understand) */}
        {!isTestMode ? (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                Spanish Expression:
              </span>
              <p className="text-2xl font-black text-white tracking-tight">
                {currentStage.phrase}
              </p>
              <p className="text-sm font-semibold text-amber-300/90">
                "{currentStage.translation}"
              </p>
              <p className="text-xs text-neutral-400 font-mono pt-1">
                Pronounced: <span className="text-neutral-300 font-semibold">{currentStage.phonetic}</span>
              </p>
            </div>

            {/* Coach Explanation */}
            <div className="rounded-2xl bg-neutral-800/60 border border-white/5 p-3.5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                <span>💡</span> Coach Insight (Spain):
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {currentStage.coachNote}
              </p>
            </div>

            {/* Start Dual Test Button */}
            <button
              onClick={() => {
                setIsTestMode(true);
                resetStepVerification();
              }}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <EyeOff className="w-4 h-4" />
              <span>I Understand It - Verify (Speak & Write from Memory)</span>
            </button>
          </div>
        ) : (
          /* Phase B: Dual Verification View (Speaking ➔ Writing) */
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* The Prompt */}
            <div className="space-y-1 pb-2 border-b border-white/5">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                <span>🧠</span> Recall Challenge:
              </span>
              <p className="text-xs text-neutral-400">Say and write the Spanish for:</p>
              <p className="text-base font-black text-white italic">
                "{currentStage.translation}"
              </p>
            </div>

            {/* 1. Speaking Section */}
            <div className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
              isSpokenVerified 
                ? 'bg-emerald-950/30 border-emerald-500/40' 
                : 'bg-neutral-800/60 border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>🎤</span> Part 1: Say it Out Loud (Microphone)
                </span>
                {isSpokenVerified && (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Spoken Verified!
                  </span>
                )}
              </div>

              {!isSpokenVerified ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleMic}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        isRecording
                          ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30'
                          : 'bg-amber-500 text-neutral-950 hover:bg-amber-400 active:scale-95'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      <span>{isRecording ? 'Listening in Spanish...' : 'Tap to Speak into Mic'}</span>
                    </button>
                    {spokenText && (
                      <span className="text-xs text-neutral-300 italic truncate max-w-[150px]">
                        "{spokenText}"
                      </span>
                    )}
                  </div>

                  {spokenFeedback && !spokenFeedback.isCorrect && (
                    <p className="text-xs text-red-300 flex items-start gap-1">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{spokenFeedback.feedback}</span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-emerald-300">
                  Great pronunciation! You said: "{spokenText || currentStage.phrase}".
                </p>
              )}
            </div>

            {/* 2. Writing Section (Unlocked once spoken or in progress) */}
            <div className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
              isWrittenVerified
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : isSpokenVerified
                ? 'bg-neutral-800/90 border-amber-500/40'
                : 'bg-neutral-800/40 border-white/5 opacity-60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-amber-400" /> Part 2: Write it from Memory (Keyboard)
                </span>
                {isWrittenVerified && (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Spelling Verified!
                  </span>
                )}
              </div>

              {!isWrittenVerified ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={writtenInput}
                      onChange={(e) => setWrittenInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && verifyWriting()}
                      placeholder={isSpokenVerified ? 'Now write it accurately in Spanish...' : 'Speak first, then write here...'}
                      disabled={!isSpokenVerified}
                      className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-400 disabled:opacity-50"
                    />
                    <button
                      onClick={verifyWriting}
                      disabled={!writtenInput.trim() || !isSpokenVerified}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        writtenInput.trim() && isSpokenVerified
                          ? 'bg-amber-500 text-neutral-950 shadow-md active:scale-95'
                          : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                      }`}
                    >
                      Check Writing
                    </button>
                  </div>

                  {writtenFeedback && !writtenFeedback.isCorrect && (
                    <p className="text-xs text-red-300 flex items-start gap-1">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{writtenFeedback.feedback}</span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-emerald-300">
                  Accurate spelling! You wrote: "{writtenInput}".
                </p>
              )}
            </div>

            {/* Proceed to Next Step (Only when BOTH verified!) */}
            {isStepFullyMastered && activeStepIndex < currentLesson.stages.length - 1 && (
              <button
                onClick={handleNextStep}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 animate-in fade-in"
              >
                <span>Step {currentStage.step} Fully Mastered! Proceed to Step {activeStepIndex + 2}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

          </div>
        )}

      </div>

      {/* Day Completion Banner */}
      {isDayFinished && (
        <div className="rounded-3xl bg-gradient-to-tr from-emerald-950/70 to-neutral-900 border border-emerald-500/60 p-5 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Day {currentLesson.day} 100% Spoken & Written!
              </h3>
              <p className="text-xs text-neutral-300">
                You successfully spoke AND wrote all 4 statements from memory!
              </p>
            </div>
          </div>

          <button
            onClick={handleAdvanceToNextDay}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Unlock Day {currentLesson.day + 1} for Tomorrow (+50 XP)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};