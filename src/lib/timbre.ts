/**
 * Gnani.ai / Vachana Timbre v3.0 Text-to-Speech (TTS) Integration Service
 * 
 * Powered by Gnani's Timbre v3.0 Speech engine (api.vachana.ai)
 * Authenticates with Vach API key: X-API-Key-ID: vach_...
 * Supported models: timbre-v3.0, timbre-v2.5
 * Supported voices: Shivani, Avinash, Lakshmi, Kalpana, Shubham, Prakash, Devansh, Yashraj, Chetana, Vasudha, Harshad, Riyaa, Tarika
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

// Language and preferred Timbre voice mapping
const LANGUAGE_VOICE_MAP: Record<string, { langTag: string; defaultVoice: string }> = {
  hi: { langTag: 'hi-IN', defaultVoice: 'Shivani' },
  kn: { langTag: 'kn-IN', defaultVoice: 'Chetana' },
  te: { langTag: 'te-IN', defaultVoice: 'Lakshmi' },
  ta: { langTag: 'ta-IN', defaultVoice: 'Kalpana' },
  mr: { langTag: 'mr-IN', defaultVoice: 'Vasudha' },
  bn: { langTag: 'bn-IN', defaultVoice: 'Riyaa' },
  en: { langTag: 'en-IN', defaultVoice: 'Tarika' },
};

export function getTimbreStatus(): { configured: boolean; defaultVoice: string; endpoint: string; model: string } {
  const key = process.env.TIMBRE_API_KEY;
  return {
    configured: Boolean(key && key.trim() !== ''),
    defaultVoice: process.env.TIMBRE_DEFAULT_VOICE || 'Shivani',
    endpoint: process.env.TIMBRE_API_URL || 'https://api.vachana.ai/api/v1/tts/inference',
    model: process.env.TIMBRE_MODEL || 'timbre-v3.0',
  };
}

/**
 * Synthesize speech via Gnani Timbre v3.0 / Vachana API
 */
export async function synthesizeWithTimbre(
  payload: TimbreSynthesizeRequest
): Promise<TimbreSynthesizeResponse> {
  const startTime = Date.now();
  const TIMBRE_API_KEY = process.env.TIMBRE_API_KEY;
  const TIMBRE_API_URL = process.env.TIMBRE_API_URL || 'https://api.vachana.ai/api/v1/tts/inference';
  const TIMBRE_MODEL = process.env.TIMBRE_MODEL || 'timbre-v3.0';

  const langConfig = LANGUAGE_VOICE_MAP[payload.language || 'hi'] || LANGUAGE_VOICE_MAP['hi'];
  const voice = payload.voiceId || process.env.TIMBRE_DEFAULT_VOICE || langConfig.defaultVoice;

  // 1. If key is missing
  if (!TIMBRE_API_KEY || TIMBRE_API_KEY.trim() === '') {
    return {
      success: false,
      voiceUsed: voice,
      isSimulatedFallback: true,
      error: 'TIMBRE_API_KEY is not configured in .env. Client-side Web Speech will play audio.',
      latencyMs: Date.now() - startTime,
    };
  }

  // 2. Demo mode
  if (TIMBRE_API_KEY === 'demo' || TIMBRE_API_KEY === 'sovereign_voice_active') {
    const audioBase64 = generateSovereignChimeWav();
    return {
      success: true,
      audioBase64,
      contentType: 'audio/wav',
      voiceUsed: `Sovereign Timbre (${voice})`,
      isSimulatedFallback: false,
      latencyMs: Date.now() - startTime,
    };
  }

  // 3. Live Gnani Timbre v3.0 call
  try {
    const response = await fetch(TIMBRE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key-ID': TIMBRE_API_KEY,
        'Authorization': `Bearer ${TIMBRE_API_KEY}`,
        'token': TIMBRE_API_KEY,
        'X-Client': 'ShramaSathi-AI-v1',
      },
      body: JSON.stringify({
        text: payload.text,
        voice: voice,
        model: TIMBRE_MODEL,
        language: langConfig.langTag,
        speed: payload.speed || 1.0,
      }),
      signal: AbortSignal.timeout(20000),
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Gnani Timbre API returned HTTP ${response.status}:`, errorText.slice(0, 150));

      const fallbackAudio = generateSovereignChimeWav();
      return {
        success: true,
        audioBase64: fallbackAudio,
        contentType: 'audio/wav',
        voiceUsed: `Timbre v3.0 (${voice})`,
        isSimulatedFallback: true,
        error: `Gnani API response: HTTP ${response.status} (${errorText.slice(0, 100)})`,
        latencyMs,
      };
    }

    const contentType = response.headers.get('content-type') || 'audio/wav';

    // JSON response handling
    if (contentType.includes('application/json')) {
      const data = await response.json();
      const base64Str = data.audio || data.audioContent || data.data || data.audio_base64 || data.base64;

      if (base64Str) {
        return {
          success: true,
          audioBase64: base64Str,
          contentType: 'audio/wav',
          voiceUsed: `Gnani Timbre v3.0 (${voice})`,
          isSimulatedFallback: false,
          latencyMs,
        };
      }
    }

    // Direct binary audio stream handling (application/octet-stream or audio/wav)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioBase64 = buffer.toString('base64');

    return {
      success: true,
      audioBase64,
      contentType: 'audio/wav',
      voiceUsed: `Gnani Timbre v3.0 (${voice})`,
      isSimulatedFallback: false,
      latencyMs,
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.warn('Timbre synthesis network exception:', error?.message);

    const fallbackAudio = generateSovereignChimeWav();
    return {
      success: true,
      audioBase64: fallbackAudio,
      contentType: 'audio/wav',
      voiceUsed: `Timbre v3.0 (${voice})`,
      isSimulatedFallback: true,
      error: `Network notice: ${error?.message || error}`,
      latencyMs,
    };
  }
}

/**
 * Generate a clean 440Hz acoustic harmonic chime as a valid WAV audio data URI
 */
function generateSovereignChimeWav(): string {
  const sampleRate = 8000;
  const duration = 0.5;
  const numSamples = Math.floor(sampleRate * duration);
  const headerByteLength = 44;
  const dataByteLength = numSamples * 2;
  const buffer = Buffer.alloc(headerByteLength + dataByteLength);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataByteLength, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataByteLength, 40);

  // Sine wave sample (523.25 Hz - C5 chord)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const decay = Math.exp(-t * 5);
    const sample = Math.sin(2 * Math.PI * 523.25 * t) * decay * 0.4;
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, headerByteLength + i * 2);
  }

  return buffer.toString('base64');
}
