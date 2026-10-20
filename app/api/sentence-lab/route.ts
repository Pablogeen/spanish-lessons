import { NextRequest, NextResponse } from 'next/server';
import { getGeminiApiKey } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  let sentence = '';
  let userId = '';
  try {
    const body = await req.json();
    sentence = body.sentence || '';
    userId = body.userId || '';

    if (!sentence || typeof sentence !== 'string') {
      return NextResponse.json({ error: 'Sentence is required' }, { status: 400 });
    }

    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      return NextResponse.json(mockSentenceEvaluation(sentence));
    }

    const prompt = `
You are an expert Castilian Spanish (español peninsular / de España) language coach.
A beginner learner wrote or spoke this Spanish sentence: "${sentence}".

Evaluate this sentence based on authentic European Spanish:
1. Score it from 50 to 100 based on grammar and natural expression.
2. Provide the most natural way a native from Spain (Madrid/Barcelona/Seville) would say it.
3. List specific corrections explaining WHY (especially highlighting Peninsular habits like vosotros, leísmo, Iberian vocab like coche/ordenador/guay/vale).
4. Give an easy pronunciation tip for Peninsular Spanish phonetics (like distinción for c/z, or rolled r).
5. Award XP (between 25 and 60).

Respond in valid JSON matching:
{
  "score": number,
  "feedback": "Warm encouraging sentence in English",
  "naturalCastilian": "Ideal natural sentence in Spanish (Spain)",
  "corrections": [
    { "original": "part of user sentence", "improved": "better version", "why": "reason in English" }
  ],
  "pronunciationTip": "Phonetic guidance for key words",
  "xpAwarded": number
}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        }
      })
    });

    if (!response.ok) {
      return NextResponse.json(mockSentenceEvaluation(sentence));
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return NextResponse.json(JSON.parse(raw));
  } catch (err: any) {
    console.error('Sentence lab error:', err);
    return NextResponse.json(mockSentenceEvaluation(sentence || 'Hola mundo'));
  }
}

function mockSentenceEvaluation(text: string) {
  const lower = text.toLowerCase();
  const corrections = [];
  let improved = text;
  let score = 88;

  if (lower.includes('carro')) {
    improved = text.replace(/carro/gi, 'coche');
    corrections.push({
      original: 'carro',
      improved: 'coche',
      why: 'In Spain, "coche" is universally used for car ("carro" usually means cart or trolley).'
    });
    score = 82;
  }

  if (lower.includes('soy calor') || lower.includes('yo soy calor')) {
    improved = 'Tengo mucho calor';
    corrections.push({
      original: 'soy calor',
      improved: 'tengo calor',
      why: 'In Spanish, we use the verb "tener" (to have) for physical sensations like heat, cold, or hunger.'
    });
    score = 75;
  }

  if (corrections.length === 0) {
    improved = text.endsWith('.') ? text : text + '.';
  }

  return {
    score: score,
    feedback: score > 85 ? '¡Olé! Brilliant formulation with great expressiveness!' : 'Good effort! Notice the subtle Iberian nuance.',
    naturalCastilian: improved,
    corrections: corrections,
    pronunciationTip: 'Remember to pronounce "c" before e/i and "z" with your tongue between teeth (/θ/ like "thin").',
    xpAwarded: Math.round(score * 0.45)
  };
}