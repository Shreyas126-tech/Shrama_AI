import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/prisma';
import { getEvonStatus } from '@/lib/evon';
import { getTimbreStatus } from '@/lib/timbre';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbStatus = await checkDatabaseConnection();
  const evonStatus = getEvonStatus();
  const timbreStatus = getTimbreStatus();

  return NextResponse.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: {
      name: 'SHRAMA SATHI AI',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
    integrations: {
      prisma: {
        provider: 'sqlite',
        connected: dbStatus.ok,
        message: dbStatus.message,
      },
      aiEngine: {
        activeProvider: evonStatus.provider,
        configured: evonStatus.configured,
        model: evonStatus.model,
        endpoint: evonStatus.endpoint,
        allAvailable: evonStatus.allAvailable,
        status: evonStatus.configured ? 'READY' : 'STATUTORY_RULES_ACTIVE',
        note: evonStatus.configured
          ? `Live AI connected via ${evonStatus.provider.toUpperCase()} (${evonStatus.model}).`
          : 'Grounded statutory Indian labour rule engine is active (4 Labour Codes).',
      },
      evon: {
        name: 'Gnani.ai Evon LLM',
        configured: Boolean(evonStatus.allAvailable.evon),
        model: 'evon-v3.3',
        status: evonStatus.allAvailable.evon ? 'READY' : 'PENDING_CREDENTIALS',
      },
      timbre: {
        name: 'Gnani.ai Timbre v3.0 TTS',
        configured: timbreStatus.configured,
        defaultVoice: timbreStatus.defaultVoice,
        endpoint: timbreStatus.endpoint,
        status: timbreStatus.configured ? 'READY' : 'PENDING_CREDENTIALS',
        note: timbreStatus.configured
          ? `Live Gnani Timbre v3.0 connected via ${timbreStatus.defaultVoice} voice.`
          : 'Server TIMBRE_API_KEY is pending. Web Speech API playback is active.',
      },
    },
  });
}
