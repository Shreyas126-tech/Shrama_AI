import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getTimbreStatus } from '@/lib/timbre';
import { getEvonStatus } from '@/lib/evon';

export const dynamic = 'force-dynamic';

export async function GET() {
  const timbre = getTimbreStatus();
  const evon = getEvonStatus();

  return NextResponse.json({
    success: true,
    timbre: {
      configured: timbre.configured,
      defaultVoice: timbre.defaultVoice,
      endpoint: timbre.endpoint,
      maskedKey: process.env.TIMBRE_API_KEY
        ? `${process.env.TIMBRE_API_KEY.slice(0, 4)}...${process.env.TIMBRE_API_KEY.slice(-4)}`
        : '',
    },
    evon: {
      configured: evon.configured,
      model: evon.model,
      endpoint: evon.endpoint,
      provider: evon.provider,
      allAvailable: evon.allAvailable,
      maskedKey: process.env.EVON_API_KEY
        ? `${process.env.EVON_API_KEY.slice(0, 4)}...${process.env.EVON_API_KEY.slice(-4)}`
        : '',
    },
    gemini: {
      configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''),
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      maskedKey: process.env.GEMINI_API_KEY
        ? `${process.env.GEMINI_API_KEY.slice(0, 4)}...${process.env.GEMINI_API_KEY.slice(-4)}`
        : '',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      timbreApiKey,
      timbreApiUrl,
      timbreVoice,
      evonApiKey,
      evonApiUrl,
      evonModel,
      geminiApiKey,
      geminiModel,
    } = body;

    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const updateEnvVar = (key: string, value: string | undefined) => {
      if (value === undefined) return;
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}="${value}"`);
      } else {
        envContent += `\n${key}="${value}"`;
      }
      process.env[key] = value;
    };

    if (timbreApiKey !== undefined) updateEnvVar('TIMBRE_API_KEY', timbreApiKey.trim());
    if (timbreApiUrl !== undefined) updateEnvVar('TIMBRE_API_URL', timbreApiUrl.trim());
    if (timbreVoice !== undefined) updateEnvVar('TIMBRE_DEFAULT_VOICE', timbreVoice.trim());

    if (evonApiKey !== undefined) updateEnvVar('EVON_API_KEY', evonApiKey.trim());
    if (evonApiUrl !== undefined) updateEnvVar('EVON_API_URL', evonApiUrl.trim());
    if (evonModel !== undefined) updateEnvVar('EVON_MODEL', evonModel.trim());

    if (geminiApiKey !== undefined) updateEnvVar('GEMINI_API_KEY', geminiApiKey.trim());
    if (geminiModel !== undefined) updateEnvVar('GEMINI_MODEL', geminiModel.trim());

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Configuration successfully updated and persisted to .env.',
      timbreConfigured: Boolean(process.env.TIMBRE_API_KEY && process.env.TIMBRE_API_KEY.trim() !== ''),
      evonConfigured: Boolean(process.env.EVON_API_KEY && process.env.EVON_API_KEY.trim() !== ''),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update configuration' },
      { status: 500 }
    );
  }
}
