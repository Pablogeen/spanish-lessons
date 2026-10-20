export type AppTheme = 'midnight' | 'sunlight' | 'rose' | 'emerald';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  emoji: string;
  bgClass: string;
  cardClass: string;
  textClass: string;
  accentClass: string;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Madrid Midnight',
    emoji: '🌙',
    bgClass: 'bg-neutral-950 text-white',
    cardClass: 'bg-neutral-900/90 border-white/10 text-white',
    textClass: 'text-white',
    accentClass: 'text-amber-400 border-amber-500/30 bg-amber-500/20',
  },
  sunlight: {
    id: 'sunlight',
    name: 'Valencia Sunlight',
    emoji: '☀️',
    bgClass: 'bg-stone-100 text-stone-900',
    cardClass: 'bg-white/95 border-stone-200 text-stone-900 shadow-md',
    textClass: 'text-stone-900',
    accentClass: 'text-amber-700 border-amber-500/40 bg-amber-100',
  },
  rose: {
    id: 'rose',
    name: 'Andalucía Rose',
    emoji: '🌹',
    bgClass: 'bg-rose-950 text-rose-50',
    cardClass: 'bg-rose-900/80 border-rose-500/20 text-rose-100',
    textClass: 'text-rose-50',
    accentClass: 'text-rose-300 border-rose-400/40 bg-rose-500/20',
  },
  emerald: {
    id: 'emerald',
    name: 'Costa Brava Green',
    emoji: '🌿',
    bgClass: 'bg-emerald-950 text-emerald-50',
    cardClass: 'bg-emerald-900/80 border-emerald-500/20 text-emerald-100',
    textClass: 'text-emerald-50',
    accentClass: 'text-emerald-300 border-emerald-400/40 bg-emerald-500/20',
  },
};

const SETTINGS_KEYS = {
  THEME: 'hablados_theme',
  CUSTOM_API_KEY: 'hablados_custom_gemini_key',
};

export function getStoredTheme(): AppTheme {
  if (typeof window === 'undefined') return 'midnight';
  const saved = localStorage.getItem(SETTINGS_KEYS.THEME) as AppTheme;
  return THEMES[saved] ? saved : 'midnight';
}

export function setStoredTheme(theme: AppTheme): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEYS.THEME, theme);
}

export function getClientApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(SETTINGS_KEYS.CUSTOM_API_KEY) || '';
}

export function setClientApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEYS.CUSTOM_API_KEY, key.trim());
}