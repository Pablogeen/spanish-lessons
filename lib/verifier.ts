// Clean string for linguistic comparison (strip accents, punctuation, extra spaces)
export function normalizeSpanish(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks for relaxed matching
    .replace(/[¡!¿?.,;:'"()\-]/g, '') // remove punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

export interface VerificationResult {
  isCorrect: boolean;
  similarityScore: number; // 0 to 100
  feedback: string;
  matchedWords: string[];
  missingWords: string[];
}

export function verifySpanishAnswer(userInput: string, targetPhrase: string): VerificationResult {
  const normUser = normalizeSpanish(userInput);
  const normTarget = normalizeSpanish(targetPhrase);

  if (!normUser) {
    return {
      isCorrect: false,
      similarityScore: 0,
      feedback: 'Please say or type your answer.',
      matchedWords: [],
      missingWords: normTarget.split(' '),
    };
  }

  // Exact normalized match
  if (normUser === normTarget) {
    return {
      isCorrect: true,
      similarityScore: 100,
      feedback: '¡Perfecto! 100% accurate pronunciation and wording!',
      matchedWords: normTarget.split(' '),
      missingWords: [],
    };
  }

  const targetWords = normTarget.split(' ').filter(Boolean);
  const userWords = normUser.split(' ').filter(Boolean);

  const matchedWords: string[] = [];
  const missingWords: string[] = [];

  for (const tWord of targetWords) {
    // Check if target word exists in user words (or very close)
    const found = userWords.some((uWord) => {
      if (uWord === tWord) return true;
      // Allow 1 typo in words longer than 3 letters
      if (tWord.length > 3 && levenshteinDistance(uWord, tWord) <= 1) return true;
      return false;
    });

    if (found) {
      matchedWords.push(tWord);
    } else {
      missingWords.push(tWord);
    }
  }

  const similarityScore = Math.round((matchedWords.length / targetWords.length) * 100);
  const isCorrect = similarityScore >= 75; // Allows 75%+ match (e.g. 3 out of 4 words or slight typo)

  let feedback = '';
  if (isCorrect) {
    feedback = '¡Muy bien! You got it right!';
  } else {
    feedback = `Not quite right yet. You missed or mispronounced: "${missingWords.join(', ')}". Try again!`;
  }

  return {
    isCorrect,
    similarityScore,
    feedback,
    matchedWords,
    missingWords,
  };
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}