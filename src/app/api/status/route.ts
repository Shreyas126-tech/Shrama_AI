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
      evon: {
        name: 'Gnani.ai Evon LLM',
        configured: evonStatus.configured,
        model: evonStatus.model,
        endpoint: evonStatus.endpoint,
        status: evonStatus.configured ? 'READY' : 'PENDING_CREDENTIALS',
        note: evonStatus.configured 
          ? 'Live Gnani Evon API connected.'
          : 'Server EVON_API_KEY is not set. Grounded statutory labour rule engine is active.',
      },
      timbre: {
        name: 'Gnani.ai Timbre TTS',
        configured: timbreStatus.configured,
        defaultVoice: timbreStatus.defaultVoice,
        endpoint: timbreStatus.endpoint,
        status: timbreStatus.configured ? 'READY' : 'PENDING_CREDENTIALS',
        note: timbreStatus.configured
          ? 'Live Gnani Timbre TTS connected.'
          : 'Server TIMBRE_API_KEY is not set. Client-side vernacular speech synthesis is active.',
      },
    },
  });
}
