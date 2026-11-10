import { NextRequest, NextResponse } from 'next/server';
import { callEvonLLM, EvonChatRequest } from '@/lib/evon';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, language = 'hi', sessionId = 'default-session', modality = 'TEXT' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: "messages" array is required.' },
        { status: 400 }
      );
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';

    // Invoke Evon LLM server-side
    const evonRequest: EvonChatRequest = {
      messages: [
        {
          role: 'system',
          content: `You are SHRAMA SATHI AI (श्रम साथी), an empathetic, knowledgeable multilingual assistant dedicated to supporting Indian workers, daily-wage laborers, migrant workers, and blue-collar staff.
Your knowledge is grounded strictly in Indian Labour Law: The Code on Wages (2019), Occupational Safety, Health and Working Conditions Code (2020), Code on Social Security (2020), e-Shram guidelines, EPF, and ESIC schemes.
Respond respectfully in the requested language (${language}). Explain complex legal or government terms in simple, practical, actionable advice. Highlight worker rights, grievance helplines (14434), and welfare schemes whenever relevant.`,
        },
        ...messages,
      ],
      language,
      temperature: 0.3,
      maxTokens: 750,
    };

    const evonResult = await callEvonLLM(evonRequest);

    // Save interaction in Prisma database
    try {
      await prisma.assistantInteraction.create({
        data: {
          sessionId,
          language,
          modality,
          userPrompt: lastUserMessage,
          aiResponse: evonResult.text,
          evonModel: evonResult.model,
          audioGenerated: false,
        },
      });
    } catch (dbErr) {
      console.warn('Prisma assistantInteraction logging notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      text: evonResult.text,
      model: evonResult.model,
      isSimulatedFallback: evonResult.isSimulatedFallback,
      latencyMs: evonResult.latencyMs,
      error: evonResult.error || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal server error processing chat.',
      },
      { status: 500 }
    );
  }
}

