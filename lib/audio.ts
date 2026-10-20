// Robust Audio Engine with Castilian Spanish (es-ES) specialization

let activeUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function speakCastilian(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  rate = 0.9
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  try {
    // Cancel any active speech cleanly
    window.speechSynthesis.cancel();
  } catch {}

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Use cached voices or fetch fresh
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  
  // Prefer native Spanish voices from Spain
  const esVoice = voices.find(
    (v) =>
      v.lang.toLowerCase() === 'es-es' ||
      v.lang.toLowerCase().includes('es_es') ||
      (v.lang.toLowerCase().startsWith('es') && v.name.toLowerCase().includes('spain')) ||
      v.name.toLowerCase().includes('mónica') ||
      v.name.toLowerCase().includes('jorge') ||
      v.name.toLowerCase().includes('castilian')
  ) || voices.find((v) => v.lang.toLowerCase().startsWith('es'));

  if (esVoice) {
    utterance.voice = esVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    activeUtterance = null;
    onEnd?.();
  };

  utterance.onerror = (e: any) => {
    // In Chromium, cancelling previous audio triggers an 'interrupted' or 'canceled' error event.
    // This is completely normal browser behavior and should not be treated as a fault.
    if (e.error === 'interrupted' || e.error === 'canceled') {
      activeUtterance = null;
      onEnd?.();
      return;
    }
    // Only log if it was an actual audio failure
    console.warn('Speech synthesis completed or stopped:', e.error);
    activeUtterance = null;
    onEnd?.();
  };

  activeUtterance = utterance;

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Audio play attempt bypassed:', err);
    onEnd?.();
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function startListening(
  onResult: (transcript: string) => void,
  onError: (err: any) => void,
  onEnd: () => void
): { stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    onError(new Error('Speech recognition not supported'));
    return null;
  }

  // @ts-ignore
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRec();

  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    if (event.error === 'no-speech' || event.error === 'aborted') {
      onEnd();
      return;
    }
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  try {
    recognition.start();
  } catch (e) {
    onError(e);
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {}
    },
  };
}