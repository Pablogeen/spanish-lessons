export type UserId = 'user1' | 'user2';

export interface UserProfile {
  id: UserId;
  name: string;
  partnerName: string;
  avatar: string;
  accentColor: 'amber' | 'rose' | 'emerald' | 'cyan';
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  lastCompletedDateGMT?: string; // YYYY-MM-DD in UTC/GMT
  level: number;
  currentDay: number; // Day 1 to Day 30+
  masteryScore: number; // 0 to 100
  sentencesCount: number;
  conversationsCount: number;
}

export interface ChatMessage {
  id: string;
  userId: UserId;
  sender: 'user' | 'tutor';
  spanishText: string;
  englishTranslation?: string;
  englishCorrection?: string;
  explanation?: string;
  scenarioId?: string;
  timestamp: number;
}

export interface DialogueExplanation {
  phraseOrWord: string;
  literalMeaning: string;
  castilianContext: string;
  grammarRule: string;
  exampleInSpain: string;
}

export interface SentenceEvaluation {
  id: string;
  userId: UserId;
  originalText: string;
  score: number;
  feedback: string;
  naturalCastilian: string;
  corrections: Array<{
    original: string;
    improved: string;
    why: string;
  }>;
  pronunciationTip?: string;
  xpAwarded: number;
  timestamp: number;
}

export interface ActivityItem {
  id: string;
  userId: UserId;
  userName: string;
  actionType: 'chat' | 'sentence' | 'streak' | 'challenge';
  description: string;
  xpEarned: number;
  timestamp: number;
}

export interface Scenario {
  id: string;
  title: string;
  location: string;
  difficulty: 'Principiante' | 'Intermedio';
  description: string;
  initialTutorMessage: string;
  initialTranslation: string;
  icon: string;
}

export interface PronunciationCard {
  id: string;
  letterOrSound: string;
  ipaSound: string;
  castilianName: string;
  howToMakeSound: string;
  exampleWords: Array<{
    word: string;
    meaning: string;
    syllables: string;
  }>;
}