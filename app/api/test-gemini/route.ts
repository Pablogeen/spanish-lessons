import { NextRequest, NextResponse } from 'next/server';
import { getGeminiApiKey } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const clientKey = req.headers.get('x-gemini-key') || body.apiKey;
    const apiKey = clientKey || getGeminiApiKey();

    if (!apiKey) {
      return NextResponse.json({ 
        connected: false, 
        message: 'No API key detected. Using local simulator.' 
      });
    }

    // Ping Gemini with a tiny test prompt
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Say "¡Hola!" in Spanish' }] }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ 
        connected: false, 
        error: 'Invalid API key or quota issue: ' + err.slice(0, 100) 
      });
    }

    return NextResponse.json({ 
      connected: true, 
      model: 'gemini-2.5-flash', 
      message: '¡Conexión exitosa con Google Gemini 2.5 Flash!' 
    });
  } catch (err: any) {
    return NextResponse.json({ 
      connected: false, 
      error: err.message || 'Connection failed' 
    });
  }
}