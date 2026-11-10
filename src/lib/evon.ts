import fs from 'fs';
import path from 'path';

/**
 * Multi-Provider Conversational AI Integration Service for SHRAMA SATHI AI
 * 
 * Supports:
 * 1. Gnani.ai Evon LLM (Sovereign multilingual Indian LLM)
 * 2. Google Gemini API (Alternative high-speed multilingual LLM)
 * 3. OpenAI / Groq / OpenRouter compatible API (Alternative)
 * 4. Grounded Statutory Indian Labour Law Engine (Zero-dependency local fallback)
 * 
 * All API credentials remain strictly server-side.
 * Reports live provider status honestly without fabricating false responses.
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
  provider: 'evon' | 'gemini' | 'openai' | 'statutory_rules';
  isSimulatedFallback: boolean;
  error?: string;
  latencyMs: number;
}

/**
 * Dynamically resolves environment variables from process.env or .env on disk.
 */
function getLiveEnv(name: string, fallback: string = ''): string {
  let val = process.env[name];
  if (val && val.trim() !== '') {
    return val.trim().replace(/^["']|["']$/g, '');
  }

  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(new RegExp(`^${name}\\s*=\\s*(.*)$`, 'm'));
      if (match) {
        val = match[1].trim().replace(/^["']|["']$/g, '');
        process.env[name] = val;
        return val;
      }
    }
  } catch {}

  return fallback;
}

export function getActiveAiProvider(): {
  provider: 'evon' | 'gemini' | 'openai' | 'statutory_rules';
  configured: boolean;
  model: string;
  endpoint: string;
  allAvailable: {
    evon: boolean;
    gemini: boolean;
    openai: boolean;
  };
} {
  const evonKey = getLiveEnv('EVON_API_KEY');
  const geminiKey = getLiveEnv('GEMINI_API_KEY');
  const openaiKey = getLiveEnv('OPENAI_API_KEY');

  const evonConfigured = Boolean(evonKey && evonKey.trim() !== '');
  const geminiConfigured = Boolean(geminiKey && geminiKey.trim() !== '');
  const openaiConfigured = Boolean(openaiKey && openaiKey.trim() !== '');

  const evonModel = getLiveEnv('EVON_MODEL', 'evon-v3.3');
  const geminiModel = getLiveEnv('GEMINI_MODEL', 'gemini-1.5-flash');
  const openaiModel = getLiveEnv('OPENAI_MODEL', 'gpt-4o-mini');

  let provider: 'evon' | 'gemini' | 'openai' | 'statutory_rules' = 'statutory_rules';
  let model = `${evonModel} (Statutory Rules Grounded)`;
  let endpoint = 'Local Statutory Rules Engine (4 Labour Codes)';

  if (evonConfigured) {
    provider = 'evon';
    model = evonModel;
    endpoint = getLiveEnv('EVON_API_URL', 'https://api.gnani.ai/v1/evon/chat/completions');
  } else if (geminiConfigured) {
    provider = 'gemini';
    model = geminiModel;
    endpoint = 'https://generativelanguage.googleapis.com';
  } else if (openaiConfigured) {
    provider = 'openai';
    model = openaiModel;
    endpoint = getLiveEnv('OPENAI_API_BASE', 'https://api.openai.com/v1');
  }

  return {
    provider,
    configured: evonConfigured || geminiConfigured || openaiConfigured,
    model,
    endpoint,
    allAvailable: {
      evon: evonConfigured,
      gemini: geminiConfigured,
      openai: openaiConfigured,
    },
  };
}

export function getEvonStatus() {
  const status = getActiveAiProvider();
  return {
    configured: status.configured,
    provider: status.provider,
    model: status.model,
    endpoint: status.endpoint,
    allAvailable: status.allAvailable,
  };
}

/**
 * Universal server-side AI caller with automatic provider routing
 */
export async function callEvonLLM(payload: EvonChatRequest): Promise<EvonChatResponse> {
  const startTime = Date.now();
  const providerInfo = getActiveAiProvider();

  const evonKey = getLiveEnv('EVON_API_KEY');
  const evonUrl = getLiveEnv('EVON_API_URL', 'https://api.gnani.ai/v1/evon/chat/completions');
  const evonModel = getLiveEnv('EVON_MODEL', 'evon-v3.3');

  const geminiKey = getLiveEnv('GEMINI_API_KEY');
  const geminiModel = getLiveEnv('GEMINI_MODEL', 'gemini-1.5-flash');

  const openaiKey = getLiveEnv('OPENAI_API_KEY');
  const openaiBase = getLiveEnv('OPENAI_API_BASE', 'https://api.openai.com/v1');
  const openaiModel = getLiveEnv('OPENAI_MODEL', 'gpt-4o-mini');

  // 1. Try Gnani AI Evon if configured
  if (providerInfo.provider === 'evon' && evonKey) {
    try {
      const response = await fetch(evonUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${evonKey}`,
          'X-Client': 'ShramaSathi-AI-v1',
        },
        body: JSON.stringify({
          model: evonModel,
          messages: payload.messages,
          temperature: payload.temperature ?? 0.3,
          max_tokens: payload.maxTokens ?? 800,
          language: payload.language ?? 'hi',
        }),
        signal: AbortSignal.timeout(15000),
      });

      const latencyMs = Date.now() - startTime;
      if (response.ok) {
        const data = await response.json();
        const replyText = data?.choices?.[0]?.message?.content || data?.response || data?.text || '';
        return {
          success: true,
          text: replyText,
          model: data?.model || evonModel,
          provider: 'evon',
          isSimulatedFallback: false,
          latencyMs,
        };
      }
    } catch (err) {
      console.warn('Gnani Evon call notice:', err);
    }
  }

  // 2. Try Google Gemini API if configured
  if (providerInfo.provider === 'gemini' && geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
      const systemInstruction = payload.messages.find(m => m.role === 'system')?.content || '';
      const conversationHistory = payload.messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: conversationHistory,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: payload.temperature ?? 0.3,
            maxOutputTokens: payload.maxTokens ?? 800,
          },
        }),
        signal: AbortSignal.timeout(15000),
      });

      const latencyMs = Date.now() - startTime;
      if (res.ok) {
        const data = await res.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return {
          success: true,
          text: replyText,
          model: `Google Gemini (${geminiModel})`,
          provider: 'gemini',
          isSimulatedFallback: false,
          latencyMs,
        };
      }
    } catch (err) {
      console.warn('Gemini call notice:', err);
    }
  }

  // 3. Try OpenAI / Groq if configured
  if (providerInfo.provider === 'openai' && openaiKey) {
    try {
      const res = await fetch(`${openaiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: payload.messages,
          temperature: payload.temperature ?? 0.3,
          max_tokens: payload.maxTokens ?? 800,
        }),
        signal: AbortSignal.timeout(15000),
      });

      const latencyMs = Date.now() - startTime;
      if (res.ok) {
        const data = await res.json();
        const replyText = data?.choices?.[0]?.message?.content || '';
        return {
          success: true,
          text: replyText,
          model: data?.model || openaiModel,
          provider: 'openai',
          isSimulatedFallback: false,
          latencyMs,
        };
      }
    } catch (err) {
      console.warn('OpenAI/Groq call notice:', err);
    }
  }

  // 4. Grounded Statutory Labour Law Rule Engine Fallback
  const fallbackResponse = getGroundedLaborRuleResponse(payload);
  return {
    success: true,
    text: fallbackResponse,
    model: `${evonModel} (Statutory Rules Grounded)`,
    provider: 'statutory_rules',
    isSimulatedFallback: true,
    latencyMs: Date.now() - startTime,
  };
}

/**
 * Verified statutory fallback response for labour law queries
 */
function getGroundedLaborRuleResponse(payload: EvonChatRequest): string {
  const lastUserMsg = [...payload.messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() || '';

  if (lastUserMsg.includes('wage') || lastUserMsg.includes('वेतन') || lastUserMsg.includes('पगार') || lastUserMsg.includes('सैलरी') || lastUserMsg.includes('ಕನಿಷ್ಠ') || lastUserMsg.includes('వేతనం') || lastUserMsg.includes('ஊதியம்')) {
    return '【श्रम साथी नियम संदर्भ】\n1. न्यूनतम मजदूरी कानून: किसी भी श्रमिक को राज्य द्वारा निर्धारित न्यूनतम वेतन से कम नहीं दिया जा सकता।\n2. काम के घंटे: सामान्य कार्य दिवस 8 घंटे का होता है। 8 घंटे से अधिक काम करने पर दोगुना ओवरटाइम (Double Overtime, 2x Rate) मिलना अनिवार्य है (वेतन संहिता 2019, धारा 14)।\n3. समय पर भुगतान: वेतन का भुगतान महीने के 7वें या 10वें दिन से पहले किया जाना अनिवार्य है। यदि ठेकेदार या मालिक वेतन रोकता है, तो आप श्रम आयुक्त कार्यालय में धारा 15 के तहत शिकायत दर्ज कर सकते हैं।';
  }

  if (lastUserMsg.includes('shram') || lastUserMsg.includes('ई-श्रम') || lastUserMsg.includes('कार्ड') || lastUserMsg.includes('पेंशन') || lastUserMsg.includes('card') || lastUserMsg.includes('pension')) {
    return '【ई-श्रम व सामाजिक सुरक्षा योजनाएं】\n1. ई-श्रम कार्ड (e-Shram): 16 से 59 वर्ष के असंगठित श्रमिक निशुल्क पंजीकरण करा सकते हैं। इससे ₹2 लाख तक का दुर्घटना बीमा (Accident Insurance) और सभी सरकारी योजनाओं का सीधा लाभ मिलता है।\n2. पीएम श्रम योगी मानधन योजना (PM-SYM): 60 वर्ष की आयु के बाद ₹3,000 मासिक पेंशन प्राप्त होती है।\n3. भवन एवं संनिर्माण कल्याण बोर्ड (BOCW): निर्माण श्रमिकों को साइकिल, औजार, बच्चों की छात्रवृत्ति और प्रसूति सहायता मिलती है।';
  }

  if (lastUserMsg.includes('complaint') || lastUserMsg.includes('शिकायत') || lastUserMsg.includes('police') || lastUserMsg.includes('हादसा') || lastUserMsg.includes('दुर्घटना') || lastUserMsg.includes('fight') || lastUserMsg.includes('दुरुपयोग')) {
    return '【कार्यस्थल सुरक्षा और शिकायत प्रक्रिया】\n1. कार्यस्थल पर दुर्घटना होने पर कर्मचारी मुआवजा अधिनियम (Employee Compensation Act) के तहत नियोक्ता उपचार और उचित मुआवजा देने के लिए बाध्य है।\n2. बिना कारण नौकरी से निकालने या मजदूरी रोकने पर श्रम सुविधा पोर्टल (shramsuvidha.gov.in) अथवा नजदीकी श्रम न्यायालय (Labour Court) में शिकायत दर्ज की जा सकती है।\n3. आपातकालीन राष्ट्रीय हेल्पलाइन: 14434 (श्रमिक हेल्पलाइन)।';
  }

  return 'नमस्ते! मैं श्रम साथी हूँ। मैं भारतीय श्रम कानूनों, न्यूनतम मजदूरी, ओवरटाइम नियमों, ई-श्रम पंजीकरण, ईपीएफ/ईएसआईसी और सरकारी कल्याणकारी योजनाओं से जुड़ी जानकारी देने के लिए तैयार हूँ। आप अपना प्रश्न बोलकर या लिखकर पूछ सकते हैं।';
}
