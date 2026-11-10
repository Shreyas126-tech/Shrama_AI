/**
 * Gnani.ai Timbre Text-to-Speech (TTS) Integration Service
 * 
 * Timbre is Gnani AI's proprietary speech synthesis engine supporting Indian vernacular languages.
 * Credentials remain strictly server-side.
 * Reports actual integration status; never returns fabricated audio.
 */

export interface TimbreSynthesizeRequest {
  text: string;
  language?: string;
  voiceId?: string;
  audioFormat?: 'wav' | 'mp3';
  speed?: number; // 0.8 to 1.5
}

export interface TimbreSynthesizeResponse {
  success: boolean;
  audioBase64?: string;
  contentType?: string;
  voiceUsed: string;
  isSimulatedFallback: boolean;
  error?: string;
  latencyMs: number;
}

const TIMBRE_API_KEY = process.env.TIMBRE_API_KEY;
const TIMBRE_API_URL = process.env.TIMBRE_API_URL || 'https://api.gnani.ai/v1/timbre/synthesize';
const TIMBRE_DEFAULT_VOICE = process.env.TIMBRE_DEFAULT_VOICE || 'timbre-hi-female-1';

export function getTimbreStatus(): { configured: boolean; defaultVoice: string; endpoint: string } {
  return {
    configured: Boolean(TIMBRE_API_KEY && TIMBRE_API_KEY.trim() !== ''),
    defaultVoice: TIMBRE_DEFAULT_VOICE,
    endpoint: TIMBRE_API_URL,
  };
}

/**
 * Synthesize speech via Gnani Timbre API
 */
export async function synthesizeWithTimbre(
  payload: TimbreSynthesizeRequest
): Promise<TimbreSynthesizeResponse> {
  const startTime = Date.now();
  const voice = payload.voiceId || TIMBRE_DEFAULT_VOICE;

  // If TIMBRE_API_KEY is not configured, report honestly
  if (!TIMBRE_API_KEY || TIMBRE_API_KEY.trim() === '') {
    return {
      success: false,
      voiceUsed: voice,
      isSimulatedFallback: true,
      error: 'TIMBRE_API_KEY is not configured in server environment. Client-side Web Speech API will be used for audible playback.',
      latencyMs: Date.now() - startTime,
    };
  }

  try {
    const response = await fetch(TIMBRE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TIMBRE_API_KEY}`,
        'X-Client': 'ShramaSathi-AI-v1',
      },
      body: JSON.stringify({
        text: payload.text,
        voice: voice,
        language: payload.language || 'hi',
        format: payload.audioFormat || 'mp3',
        speed: payload.speed || 1.0,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        voiceUsed: voice,
        isSimulatedFallback: false,
        error: `Gnani Timbre API error ${response.status}: ${errorText}`,
        latencyMs,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioBase64 = buffer.toString('base64');
    const contentType = payload.audioFormat === 'wav' ? 'audio/wav' : 'audio/mpeg';

    return {
      success: true,
      audioBase64,
      contentType,
      voiceUsed: voice,
      isSimulatedFallback: false,
      latencyMs,
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      voiceUsed: voice,
      isSimulatedFallback: false,
      error: error?.message || String(error),
      latencyMs,
    };
  }
}
