import { NextRequest, NextResponse } from 'next/server';
import { buildAdaptivePrompt, getGeminiApiKey } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, level = 1, currentDay = 1, lessonTitle = 'First Words', apiKey: bodyApiKey } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Priority: Header > Body > Server Environment
    const clientKey = req.headers.get('x-gemini-key') || bodyApiKey;
    const apiKey = clientKey || getGeminiApiKey();

    if (!apiKey) {
      return NextResponse.json(generateBeginnerMockResponse(message, currentDay));
    }

    const systemPrompt = buildAdaptivePrompt(level, currentDay, lessonTitle);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          ...(history || []).map((h: any) => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.spanishText }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API call failed, using mock response');
      return NextResponse.json(generateBeginnerMockResponse(message, currentDay));
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json(generateBeginnerMockResponse(message, currentDay));
    }

    const parsed = JSON.parse(rawText);
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Chat API Route Error:', err);
    return NextResponse.json({
      spanishResponse: '¡Muy bien!',
      englishTranslation: 'Very good!',
      coachGuidance: 'You are doing great! Let us continue step by step.',
      userCorrection: null,
      suggestedFollowUp: '¡Hola!'
    });
  }
}

function generateBeginnerMockResponse(userMsg: string, day: number) {
  const lower = userMsg.toLowerCase().trim();

  if (day === 1) {
    if (lower.includes('hola') || lower.includes('llamo')) {
      return {
        spanishResponse: '¡Encantado de conocerte! ¡Muy bien!',
        englishTranslation: 'Delighted to meet you! Very well done!',
        coachGuidance: "Fantastic job! You just spoke authentic Spanish! Notice how the 'H' in '¡Hola!' was totally silent? Now try saying goodbye: '¡Adiós!'",
        userCorrection: null,
        suggestedFollowUp: '¡Adiós, David!'
      };
    }
    return {
      spanishResponse: '¡Hola! Me llamo David.',
      englishTranslation: 'Hello! My name is David.',
      coachGuidance: "Welcome to Day 1! Don't worry at all. Just type or say: '¡Hola! Me llamo [your name]'",
      userCorrection: null,
      suggestedFollowUp: '¡Hola! Me llamo Alex.'
    };
  }

  return {
    spanishResponse: '¡Estupendo! Lo estás haciendo genial.',
    englishTranslation: 'Wonderful! You are doing great.',
    coachGuidance: 'Step by step, you are building real Spanish foundations!',
    userCorrection: null,
    suggestedFollowUp: 'Muchas gracias'
  };
}