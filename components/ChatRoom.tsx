'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Mic, MicOff, Volume2, HelpCircle, Sparkles, 
  ChevronDown, BookOpen, AlertCircle, CheckCircle2, RotateCcw
} from 'lucide-react';
import { SCENARIOS } from '@/lib/scenarios';
import { ChatMessage, DialogueExplanation, Scenario, UserId, UserProfile } from '@/lib/types';
import { speakCastilian, stopSpeaking, startListening, isSpeechRecognitionSupported } from '@/lib/audio';
import { getChatMessages, saveChatMessages, awardXp } from '@/lib/storage';
import { getClientApiKey } from '@/lib/settings';
import { AudioWave } from './AudioWave';

interface ChatRoomProps {
  activeProfile: UserProfile;
  onXpEarned: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ activeProfile, onXpEarned }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[4] || SCENARIOS[0]); // Default to Free Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [explanationData, setExplanationData] = useState<DialogueExplanation | null>(null);
  const [showEnglishMap, setShowEnglishMap] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const saved = getChatMessages(activeProfile.id, selectedScenario.id);
    if (saved.length > 0) {
      setMessages(saved);
    } else {
      const initial: ChatMessage = {
        id: 'msg-init-' + selectedScenario.id,
        userId: activeProfile.id,
        sender: 'tutor',
        spanishText: selectedScenario.initialTutorMessage,
        englishTranslation: selectedScenario.initialTranslation,
        scenarioId: selectedScenario.id,
        timestamp: Date.now(),
      };
      setMessages([initial]);
      saveChatMessages(activeProfile.id, selectedScenario.id, [initial]);
    }
  }, [activeProfile.id, selectedScenario.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handlePlayAudio = (text: string, messageId: string) => {
    if (speakingMessageId === messageId && isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId(messageId);
    setIsSpeaking(true);
    speakCastilian(
      text,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      }
    );
  };

  const handleToggleEnglish = (id: string) => {
    setShowEnglishMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleMic = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    setIsRecording(true);
    recognitionRef.current = startListening(
      (transcript) => {
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      },
      (err) => {
        console.error('Mic error:', err);
        setIsRecording(false);
      },
      () => setIsRecording(false)
    );
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanInput = inputText.trim();
    if (!cleanInput || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      userId: activeProfile.id,
      sender: 'user',
      spanishText: cleanInput,
      scenarioId: selectedScenario.id,
      timestamp: Date.now(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText('');
    setIsLoading(true);

    try {
      const clientKey = getClientApiKey();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-gemini-key': clientKey
        },
        body: JSON.stringify({
          message: cleanInput,
          scenarioTitle: selectedScenario.title,
          currentDay: activeProfile.currentDay || 1,
          level: activeProfile.level || 1,
          history: updated.slice(-6),
          apiKey: clientKey,
        }),
      });

      const data = await res.json();

      if (data.userCorrection) {
        userMsg.englishCorrection = data.userCorrection;
      }

      const tutorMsg: ChatMessage = {
        id: 'msg-tutor-' + Date.now(),
        userId: activeProfile.id,
        sender: 'tutor',
        spanishText: data.spanishResponse,
        englishTranslation: data.englishTranslation,
        explanation: data.coachGuidance,
        scenarioId: selectedScenario.id,
        timestamp: Date.now(),
      };

      const finalMessages = [...updated, tutorMsg];
      setMessages(finalMessages);
      saveChatMessages(activeProfile.id, selectedScenario.id, finalMessages);

      awardXp(activeProfile.id, 20, `Chatted in Spanish: "${selectedScenario.title}"`, 'chat');
      onXpEarned();

      handlePlayAudio(data.spanishResponse, tutorMsg.id);
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainPhrase = async (phrase: string) => {
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase, context: selectedScenario.title }),
      });
      const data = await res.json();
      setExplanationData(data);
    } catch (err) {
      console.error('Explain error:', err);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto px-4 pb-28 pt-2">
      
      {/* Title & Badge */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Coach David</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live AI Chat
            </span>
          </h2>
          <p className="text-xs text-neutral-400">Talk about anything in Madrid Spanish with instant feedback</p>
        </div>
      </div>

      {/* Scenario Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 shrink-0">
        {SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 border ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                  : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              <span>{sc.icon}</span>
              <span>{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pt-2 max-h-[55vh]">
        {messages.map((msg) => {
          const isTutor = msg.sender === 'tutor';
          const isPlayingThis = speakingMessageId === msg.id && isSpeaking;
          const showEng = showEnglishMap[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'} animate-in fade-in duration-300`}
            >
              <div
                className={`relative max-w-[88%] rounded-3xl p-4 shadow-xl border backdrop-blur-xl ${
                  isTutor
                    ? 'bg-neutral-900/90 border-white/10 text-white rounded-tl-sm'
                    : 'bg-gradient-to-br from-amber-600 to-amber-700 text-neutral-950 font-medium rounded-tr-sm border-amber-400/30'
                }`}
              >
                {isTutor && (
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <span>🇪🇸</span> Coach David
                    </span>
                    <AudioWave isActive={isPlayingThis} color="bg-amber-400" />
                  </div>
                )}

                {/* English Coach Guidance if present */}
                {isTutor && msg.explanation && (
                  <p className="text-xs text-neutral-300 mb-2 leading-relaxed">
                    {msg.explanation}
                  </p>
                )}

                <p className={`text-base leading-relaxed tracking-tight ${isTutor ? 'text-neutral-100' : 'text-neutral-950 font-semibold'}`}>
                  {msg.spanishText}
                </p>

                {isTutor && msg.englishTranslation && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    {showEng ? (
                      <p className="text-xs text-neutral-300 italic animate-in fade-in">
                        {msg.englishTranslation}
                      </p>
                    ) : (
                      <button
                        onClick={() => handleToggleEnglish(msg.id)}
                        className="text-[11px] text-amber-400/80 hover:text-amber-300 font-medium flex items-center gap-1"
                      >
                        <span>👁️ Tap to reveal English</span>
                      </button>
                    )}
                  </div>
                )}

                {isTutor && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handlePlayAudio(msg.spanishText, msg.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                        isPlayingThis
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingThis ? 'Speaking...' : 'Listen'}</span>
                    </button>

                    <button
                      onClick={() => handleExplainPhrase(msg.spanishText)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200 text-xs"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Explain</span>
                    </button>
                  </div>
                )}
              </div>

              {msg.englishCorrection && (
                <div className="mt-1.5 max-w-[85%] rounded-2xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-200 shadow-sm">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{msg.englishCorrection}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-neutral-400 text-xs pl-2 py-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-150" />
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-300" />
            <span>Coach David is replying from Madrid...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="mt-3 flex items-center gap-2 p-1.5 rounded-full bg-neutral-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl"
      >
        <button
          type="button"
          onClick={handleToggleMic}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-neutral-800 text-neutral-300 hover:text-white'
          }`}
          title="Speak in Spanish"
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isRecording ? 'Listening...' : 'Chat in Spanish with Coach David...'}
          className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-white placeholder-neutral-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            inputText.trim() && !isLoading
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'bg-neutral-800 text-neutral-600'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Explanation Drawer */}
      {explanationData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Grammar & Slang Breakdown</h3>
              </div>
              <button
                onClick={() => setExplanationData(null)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded-full bg-neutral-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="font-bold text-amber-300 text-base">{explanationData.phraseOrWord}</p>
              <p className="text-neutral-300">{explanationData.literalMeaning}</p>
              <p className="text-neutral-400 bg-neutral-800 p-2.5 rounded-xl">{explanationData.castilianContext}</p>
              <p className="italic text-amber-200">{explanationData.exampleInSpain}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};