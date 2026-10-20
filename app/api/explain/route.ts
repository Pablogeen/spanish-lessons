import { NextRequest, NextResponse } from 'next/server';
import { getGeminiApiKey } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  let phrase = '';
  let context = '';
  try {
    const body = await req.json();
    phrase = body.phrase || '';
    context = body.context || '';

    if (!phrase) {
      return NextResponse.json({ error: 'Phrase is required' }, { status: 400 });
    }

    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      return NextResponse.json(getLocalExplanation(phrase));
    }

    const prompt = `
You are an expert Castilian Spanish tutor. A learner wants a clear, conversational explanation of this Spanish phrase or word: "${phrase}".
Context it appeared in: "${context || 'Conversational Spanish in Spain'}".

Return a JSON object with:
- "phraseOrWord": the phrase
- "literalMeaning": word-for-word translation in English
- "castilianContext": how natives in Madrid/Spain naturally use it
- "grammarRule": easy-to-understand breakdown of the grammar (no overly technical jargon)
- "exampleInSpain": a realistic daily Spain example sentence with English translation
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        }
      })
    });

    if (!response.ok) {
      return NextResponse.json(getLocalExplanation(phrase));
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return NextResponse.json(JSON.parse(raw));
  } catch (err: any) {
    console.error('Explain route error:', err);
    return NextResponse.json(getLocalExplanation(phrase || 'phrase'));
  }
}

function getLocalExplanation(phrase: string) {
  return {
    phraseOrWord: phrase,
    literalMeaning: `Meaning of "${phrase}"`,
    castilianContext: 'Widely spoken throughout Spain in bars, cafes, and everyday conversations.',
    grammarRule: 'In Castilian Spanish, verbs agree with the subject and colloquial expressions often use verbs like "apetecer" (to feel like) or "poner" (to serve/place).',
    exampleInSpain: '¿Os apetece una caña con unas bravas? (Do you guys feel like a draft beer with spicy potatoes?)'
  };
}