import { NextRequest, NextResponse } from 'next/server';
import { synthesizeWithTimbre, TimbreSynthesizeRequest } from '@/lib/timbre';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = 'hi', voiceId, speed = 1.0 } = body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid request: "text" string is required.' },
        { status: 400 }
      );
    }

    const timbreRequest: TimbreSynthesizeRequest = {
      text,
      language,
      voiceId,
      speed,
      audioFormat: 'mp3',
    };

    const result = await synthesizeWithTimbre(timbreRequest);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal server error during speech synthesis.',
      },
      { status: 500 }
    );
  }
}

