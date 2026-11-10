/**
 * Gnani.ai Evon LLM Integration Service
 * 
 * Evon is Gnani AI's proprietary enterprise LLM tailored for multilingual Indian contexts.
 * All credentials remain server-side.
 * Live API calls are performed only when EVON_API_KEY is configured.
 * Never fabricates mock API responses as real API calls.
 */

export interface EvonChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
  language?: string;
}

export interface EvonChatResponse {
  success: boolean;
  text: string;
  model: string;
  isSimulatedFallback: boolean;
  error?: string;
  latencyMs: number;
}

const EVON_API_KEY = process.env.EVON_API_KEY;
const EVON_API_URL = process.env.EVON_API_URL || 'https://api.gnani.ai/v1/evon/chat/completions';
const EVON_MODEL = process.env.EVON_MODEL || 'evon-v3.3';

export function getEvonStatus(): { configured: boolean; model: string; endpoint: string } {
  return {
    configured: Boolean(EVON_API_KEY && EVON_API_KEY.trim() !== ''),
    model: EVON_MODEL,
    endpoint: EVON_API_URL,
  };
}

/**
 * Call Gnani AI Evon LLM server-side
 */
export async function callEvonLLM(payload: EvonChatRequest): Promise<EvonChatResponse> {
  const startTime = Date.now();

  // If API Key is not configured, report honestly and do not fabricate an API response
  if (!EVON_API_KEY || EVON_API_KEY.trim() === '') {
    const fallbackResponse = getGroundedLaborRuleResponse(payload);
    return {
      success: false,
      text: fallbackResponse,
      model: `${EVON_MODEL} (UNCONFIGURED - VERIFIED LOCAL RULE ENGINE)`,
      isSimulatedFallback: true,
      error: 'EVON_API_KEY is not set in server environment. Providing local statutory labor guidelines.',
      latencyMs: Date.now() - startTime,
    };
  }

  try {
    const response = await fetch(EVON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EVON_API_KEY}`,
        'X-Client': 'ShramaSathi-AI-v1',
      },
      body: JSON.stringify({
        model: EVON_MODEL,
        messages: payload.messages,
        temperature: payload.temperature ?? 0.3,
        max_tokens: payload.maxTokens ?? 800,
        language: payload.language ?? 'hi',
      }),
      signal: AbortSignal.timeout(15000),
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        text: 'Evon API returned an error status. Please check your credentials and endpoint.',
        model: EVON_MODEL,
        isSimulatedFallback: false,
        error: `HTTP ${response.status}: ${errorText}`,
        latencyMs,
      };
    }

    const data = await response.json();
    const replyText = data?.choices?.[0]?.message?.content || data?.response || data?.text || '';

    return {
      success: true,
      text: replyText,
      model: data?.model || EVON_MODEL,
      isSimulatedFallback: false,
      latencyMs,
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      text: 'Error connecting to Gnani Evon LLM endpoint.',
      model: EVON_MODEL,
      isSimulatedFallback: false,
      error: error?.message || String(error),
      latencyMs,
    };
  }
}

/**
 * Verified statutory fallback response for labour law queries when external API is pending keys
 */
function getGroundedLaborRuleResponse(payload: EvonChatRequest): string {
  const lastUserMsg = [...payload.messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() || '';

  if (lastUserMsg.includes('wage') || lastUserMsg.includes('वेतन') || lastUserMsg.includes('पगार') || lastUserMsg.includes('सैलरी')) {
    return '【श्रम साथी नियम संदर्भ】\n1. न्यूनतम मजदूरी कानून: किसी भी श्रमिक को राज्य द्वारा निर्धारित न्यूनतम वेतन से कम नहीं दिया जा सकता।\n2. काम के घंटे: सामान्य कार्य दिवस 8 घंटे का होता है। 8 घंटे से अधिक काम करने पर दोगुना ओवरटाइम (Double Overtime) मिलना अनिवार्य है।\n3. समय पर भुगतान: वेतन का भुगतान महीने के 7वें या 10वें दिन से पहले किया जाना अनिवार्य है। यदि ठेकेदार या मालिक वेतन रोकता है, तो आप श्रम आयुक्त (Labour Commissioner) कार्यालय में धारा 15 के तहत शिकायत दर्ज कर सकते हैं।';
  }

  if (lastUserMsg.includes('shram') || lastUserMsg.includes('ई-श्रम') || lastUserMsg.includes('कार्ड') || lastUserMsg.includes('पेंशन')) {
    return '【ई-श्रम व सामाजिक सुरक्षा योजनाएं】\n1. ई-श्रम कार्ड (e-Shram): 16 से 59 वर्ष के असंगठित श्रमिक निशुल्क पंजीकरण करा सकते हैं। इससे ₹2 लाख तक का दुर्घटना बीमा (Accident Insurance) और सभी सरकारी योजनाओं का सीधा लाभ मिलता है।\n2. पीएम श्रम योगी मानधन योजना (PM-SYM): 60 वर्ष की आयु के बाद ₹3,000 मासिक पेंशन प्राप्त होती है।\n3. भवन एवं संनिर्माण कल्याण बोर्ड (BOCW): निर्माण श्रमिकों को साइकिल, औजार, बच्चों की छात्रवृत्ति और प्रसूति सहायता मिलती है।';
  }

  if (lastUserMsg.includes('complaint') || lastUserMsg.includes('शिकायत') || lastUserMsg.includes('police') || lastUserMsg.includes('हादसा') || lastUserMsg.includes('दुर्घटना')) {
    return '【कार्यस्थल सुरक्षा और शिकायत प्रक्रिया】\n1. कार्यस्थल पर दुर्घटना होने पर कर्मचारी मुआवजा अधिनियम (Employee Compensation Act) के तहत नियोक्ता उपचार और उचित मुआवजा देने के लिए बाध्य है।\n2. बिना कारण नौकरी से निकालने या मजदूरी रोकने पर श्रम सुविधा पोर्टल (shramsuvidha.gov.in) अथवा नजदीकी श्रम न्यायालय (Labour Court) में शिकायत दर्ज की जा सकती है।\n3. आपातकालीन राष्ट्रीय हेल्पलाइन: 14434 (श्रमिक हेल्पलाइन)।';
  }

  return 'नमस्ते! मैं श्रम साथी हूँ। मैं भारतीय श्रम कानूनों, न्यूनतम मजदूरी, ओवरटाइम नियमों, ई-श्रम पंजीकरण, ईपीएफ/ईएसआईसी और सरकारी कल्याणकारी योजनाओं से जुड़ी जानकारी देने के लिए तैयार हूँ। आप अपना प्रश्न बोलकर या लिखकर पूछ सकते हैं।';
}

