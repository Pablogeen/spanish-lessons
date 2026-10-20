import { UserId, UserProfile, ChatMessage, ActivityItem } from './types';

const STORAGE_KEYS = {
  ACTIVE_USER: 'hablados_active_user',
  PROFILES: 'hablados_profiles',
  MESSAGES: 'hablados_messages',
  ACTIVITIES: 'hablados_activities',
};

function getGMTDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function getGMTYesterdayString(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
}

const DEFAULT_PROFILES: Record<UserId, UserProfile> = {
  user1: {
    id: 'user1',
    name: 'Él (You)',
    partnerName: 'Ella',
    avatar: '🦁',
    accentColor: 'amber',
    xp: 60,
    streak: 1,
    currentDay: 1,
    masteryScore: 85,
    lastActiveDate: getGMTDateString(),
    lastCompletedDateGMT: undefined,
    level: 1,
    sentencesCount: 2,
    conversationsCount: 1,
  },
  user2: {
    id: 'user2',
    name: 'Ella (Her)',
    partnerName: 'Él',
    avatar: '👑',
    accentColor: 'rose',
    xp: 60,
    streak: 1,
    currentDay: 1,
    masteryScore: 85,
    lastActiveDate: getGMTDateString(),
    lastCompletedDateGMT: undefined,
    level: 1,
    sentencesCount: 2,
    conversationsCount: 1,
  },
};

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    userId: 'user1',
    userName: 'Él',
    actionType: 'chat',
    description: 'Started Day 1: Learned how to say "¡Hola! Me llamo..." in Madrid Spanish! 🇪🇸',
    xpEarned: 30,
    timestamp: Date.now() - 1000 * 60 * 20,
  },
  {
    id: 'act-2',
    userId: 'user2',
    userName: 'Ella',
    actionType: 'streak',
    description: 'Started the couple journey together! Day 1 streak started 🔥',
    xpEarned: 30,
    timestamp: Date.now() - 1000 * 60 * 15,
  }
];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getActiveUserId(): UserId {
  if (!isBrowser()) return 'user1';
  const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
  return (saved === 'user2' ? 'user2' : 'user1');
}

export function setActiveUserId(id: UserId): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, id);
}

export function getProfiles(): Record<UserId, UserProfile> {
  if (!isBrowser()) return DEFAULT_PROFILES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.user1.currentDay) parsed.user1.currentDay = 1;
    if (!parsed.user1.masteryScore) parsed.user1.masteryScore = 80;
    if (!parsed.user2.currentDay) parsed.user2.currentDay = 1;
    if (!parsed.user2.masteryScore) parsed.user2.masteryScore = 80;
    return parsed;
  } catch {
    return DEFAULT_PROFILES;
  }
}

export function updateProfile(id: UserId, updates: Partial<UserProfile>): UserProfile {
  const profiles = getProfiles();
  const current = profiles[id] || DEFAULT_PROFILES[id];
  const updated: UserProfile = { ...current, ...updates };
  profiles[id] = updated;
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }
  return updated;
}

/**
 * Check if the user has already completed today's lesson (based on GMT 00:00).
 * Returns true if lesson is LOCKED (already done today, must wait until tomorrow).
 */
export function isDayLocked(id: UserId): boolean {
  const profiles = getProfiles();
  const user = profiles[id];
  if (!user || !user.lastCompletedDateGMT) return false;
  const todayGMT = getGMTDateString();
  return user.lastCompletedDateGMT === todayGMT;
}

/**
 * Returns hours and minutes until 00:00 GMT (next day unlock).
 */
export function getTimeUntilUnlock(): { hours: number; minutes: number } {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0
  ));
  const diffMs = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
}

export function advanceDay(id: UserId): UserProfile {
  const profiles = getProfiles();
  const user = profiles[id];
  const todayGMT = getGMTDateString();

  // Enforce GMT lock: don't advance if already completed today
  if (user.lastCompletedDateGMT === todayGMT) {
    return user;
  }

  const nextDay = (user.currentDay || 1) + 1;
  const newLevel = Math.min(Math.floor((nextDay - 1) / 7) + 1, 4);
  const newMastery = Math.min((user.masteryScore || 80) + 3, 100);

  const updated = updateProfile(id, {
    currentDay: nextDay,
    level: newLevel,
    masteryScore: newMastery,
    lastCompletedDateGMT: todayGMT,
  });

  addActivity({
    id: 'act-' + Date.now(),
    userId: id,
    userName: user.name.split(' ')[0],
    actionType: 'challenge',
    description: `Passed Day ${user.currentDay} with flying colors! Unlocked Day ${nextDay} 🎉`,
    xpEarned: 50,
    timestamp: Date.now(),
  });

  return updated;
}

export function awardXp(id: UserId, amount: number, actionDescription: string, actionType: ActivityItem['actionType']): void {
  const profiles = getProfiles();
  const user = profiles[id];
  if (!user) return;

  const today = getGMTDateString();
  let newStreak = user.streak || 1;
  
  if (user.lastActiveDate !== today) {
    const yesterday = getGMTYesterdayString();
    if (user.lastActiveDate === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  const newXp = (user.xp || 0) + amount;
  const newMastery = Math.min((user.masteryScore || 80) + 1, 100);

  updateProfile(id, {
    xp: newXp,
    streak: newStreak,
    masteryScore: newMastery,
    lastActiveDate: today,
  });

  addActivity({
    id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    userId: id,
    userName: user.name.split(' ')[0],
    actionType,
    description: actionDescription,
    xpEarned: amount,
    timestamp: Date.now(),
  });
}

export function getChatMessages(userId: UserId, scenarioId: string): ChatMessage[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.MESSAGES}_${userId}_${scenarioId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChatMessages(userId: UserId, scenarioId: string, messages: ChatMessage[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(`${STORAGE_KEYS.MESSAGES}_${userId}_${scenarioId}`, JSON.stringify(messages));
}

export function getCoupleActivities(): ActivityItem[] {
  if (!isBrowser()) return INITIAL_ACTIVITIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return raw ? JSON.parse(raw) : INITIAL_ACTIVITIES;
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function addActivity(item: ActivityItem): void {
  if (!isBrowser()) return;
  const list = getCoupleActivities();
  const updated = [item, ...list].slice(0, 30);
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
}