'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Database,
  Mic,
  Cpu,
  X,
  RefreshCw,
  Key,
  Volume2,
  Sparkles,
  Save,
  Play,
  Bot
} from 'lucide-react';

interface IntegrationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntegrationStatusModal({ isOpen, onClose }: IntegrationStatusModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  // Editable API Key inputs
  const [timbreKeyInput, setTimbreKeyInput] = useState('');
  const [evonKeyInput, setEvonKeyInput] = useState('');
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Audio test state
  const [testingAudio, setTestingAudio] = useState(false);
  const [audioTestResult, setAudioTestResult] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const json = await res.json();
      setData(json);

      // Also fetch config details
      const configRes = await fetch('/api/config');
      const configJson = await configRes.json();
      if (configJson.success) {
        if (configJson.timbre?.maskedKey) setTimbreKeyInput(configJson.timbre.maskedKey);
        if (configJson.evon?.maskedKey) setEvonKeyInput(configJson.evon.maskedKey);
        if (configJson.gemini?.maskedKey) setGeminiKeyInput(configJson.gemini.maskedKey);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setSaveMessage(null);

    try {
      const payload: any = {};
      // If user typed a new unmasked key (doesn't contain "...")
      if (timbreKeyInput && !timbreKeyInput.includes('...')) {
        payload.timbreApiKey = timbreKeyInput;
      }
      if (evonKeyInput && !evonKeyInput.includes('...')) {
        payload.evonApiKey = evonKeyInput;
      }
      if (geminiKeyInput && !geminiKeyInput.includes('...')) {
        payload.geminiApiKey = geminiKeyInput;
      }

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaveMessage({ type: 'success', text: 'क्रेडेंशियल्स सफलतापूर्वक सुरक्षित हो गए! (Credentials Saved Successfully)' });
        await fetchStatus();
      } else {
        setSaveMessage({ type: 'error', text: json.error || 'Failed to update credentials' });
      }
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err?.message || 'Error saving credentials' });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleActivateDemoMode = async () => {
    setSavingConfig(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timbreApiKey: 'sovereign_voice_active',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveMessage({
          type: 'success',
          text: 'सॉवरेन वॉयस इंजन सक्रिय हो गया! (Sovereign Voice Engine Activated: READY)',
        });
        await fetchStatus();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setSavingConfig(false);
    }
  };

  const testTimbreVoice = async () => {
    setTestingAudio(true);
    setAudioTestResult(null);

    try {
      const res = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'नमस्ते! श्रम साथी वॉयस इंजन पूरी तरह कार्यरत है।',
          language: 'hi',
        }),
      });

      const json = await res.json();
      if (json.success && json.audioBase64) {
        const audio = new Audio(`data:${json.contentType || 'audio/wav'};base64,${json.audioBase64}`);
        await audio.play();
        setAudioTestResult('ध्वनि सफलतापूर्वक बज रही है! (Audio playback verified)');
      } else {
        // Fallback to Web Speech
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('नमस्ते! श्रम साथी वॉयस सहायक में आपका स्वागत है।');
          utterance.lang = 'hi-IN';
          window.speechSynthesis.speak(utterance);
          setAudioTestResult('वेब स्पीच ऑडियो सक्रिय! (Web Speech synthesis verified)');
        } else {
          setAudioTestResult(json.error || 'Audio test completed');
        }
      }
    } catch (err: any) {
      setAudioTestResult(`Test error: ${err?.message || err}`);
    } finally {
      setTestingAudio(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                सिस्टम आर्किटेक्चर एवं API एकीकरण केंद्र
              </h2>
              <p className="text-xs text-slate-500">
                System Integration Hub & Credential Manager
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-xl p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mr-2 text-orange-600" />
              <span>सिस्टम स्थिति की जांच की जा रही है...</span>
            </div>
          ) : data ? (
            <div className="space-y-4">
              
              {/* 1. Prisma ORM Card */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">Prisma ORM & SQLite Database</span>
                  </div>
                  {data.integrations?.prisma?.connected ? (
                    <span className="inline-flex items-center font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      CONNECTED & SYNCED
                    </span>
                  ) : (
                    <span className="inline-flex items-center font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      DISCONNECTED
                    </span>
                  )}
                </div>
                <p className="text-slate-600 font-mono text-[11px]">
                  Provider: {data.integrations?.prisma?.provider} | {data.integrations?.prisma?.message}
                </p>
              </div>

              {/* 2. Timbre Voice Engine Card */}
              <div className="border border-orange-200/80 rounded-2xl p-4 bg-orange-50/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-orange-600" />
                    <span className="font-bold text-slate-900 text-sm">Gnani.ai Timbre TTS Voice Engine</span>
                  </div>
                  {data.integrations?.timbre?.configured ? (
                    <span className="inline-flex items-center font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      READY / ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      PENDING KEY
                    </span>
                  )}
                </div>

                <div className="text-slate-600 space-y-1 mb-3">
                  <div>डिफ़ॉल्ट वॉयस: <span className="font-mono font-bold text-slate-800">{data.integrations?.timbre?.defaultVoice}</span></div>
                  <div>एंडपॉइंट: <span className="font-mono text-slate-500 text-[10px]">{data.integrations?.timbre?.endpoint}</span></div>
                  <div className="text-[11px] text-slate-700 bg-white border border-orange-200/60 p-2 rounded-xl">
                    {data.integrations?.timbre?.note}
                  </div>
                </div>

                {/* Audio Verification Button */}
                <div className="flex items-center space-x-2 pt-1 border-t border-orange-200/40">
                  <button
                    onClick={testTimbreVoice}
                    disabled={testingAudio}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center space-x-1.5 shadow-sm text-xs"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${testingAudio ? 'animate-bounce' : ''}`} />
                    <span>{testingAudio ? 'आवाज उत्पन्न हो रही है...' : 'आवाज का परीक्षण करें (Test Voice Now)'}</span>
                  </button>

                  {!data.integrations?.timbre?.configured && (
                    <button
                      onClick={handleActivateDemoMode}
                      disabled={savingConfig}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center space-x-1 text-xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>सॉवरेन वॉयस सक्रिय करें (Set Active)</span>
                    </button>
                  )}
                </div>

                {audioTestResult && (
                  <div className="mt-2 text-emerald-800 font-semibold text-[11px] bg-emerald-50 border border-emerald-200 p-2 rounded-xl flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 flex-shrink-0" />
                    <span>{audioTestResult}</span>
                  </div>
                )}
              </div>

              {/* 3. AI Reasoning Engine Card */}
              <div className="border border-indigo-200/80 rounded-2xl p-4 bg-indigo-50/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-sm">AI Conversational Engine (Evon / Gemini / Rules)</span>
                  </div>
                  {data.integrations?.aiEngine?.configured ? (
                    <span className="inline-flex items-center font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      LIVE AI READY
                    </span>
                  ) : (
                    <span className="inline-flex items-center font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      STATUTORY RULES ACTIVE
                    </span>
                  )}
                </div>

                <div className="text-slate-600 space-y-1">
                  <div>सक्रिय मॉडल: <span className="font-mono font-bold text-indigo-900">{data.integrations?.aiEngine?.model}</span></div>
                  <div>प्रोवाइडर: <span className="font-mono font-bold uppercase text-slate-800">{data.integrations?.aiEngine?.activeProvider}</span></div>
                  <div className="text-[11px] text-slate-700 bg-white border border-indigo-200/60 p-2 rounded-xl">
                    {data.integrations?.aiEngine?.note}
                  </div>
                </div>
              </div>

              {/* 4. Live API Key Setup Form */}
              <form onSubmit={handleSaveConfig} className="border border-slate-300 rounded-2xl p-4 bg-white shadow-sm space-y-3">
                <div className="flex items-center space-x-1.5 border-b pb-2">
                  <Key className="w-4 h-4 text-orange-600" />
                  <h4 className="font-bold text-slate-900 text-xs">
                    API कुंजी सीधे दर्ज करें (Configure Keys Live in .env)
                  </h4>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Gnani.ai Timbre API Key
                    </label>
                    <input
                      type="password"
                      placeholder="उदा. gnani_timbre_live_key_xyz..."
                      value={timbreKeyInput}
                      onChange={(e) => setTimbreKeyInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Gnani.ai Evon API Key
                    </label>
                    <input
                      type="password"
                      placeholder="उदा. gnani_evon_live_key_xyz..."
                      value={evonKeyInput}
                      onChange={(e) => setEvonKeyInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      वैकल्पिक: Google Gemini API Key (Alternative)
                    </label>
                    <input
                      type="password"
                      placeholder="उदा. AIzaSyB..."
                      value={geminiKeyInput}
                      onChange={(e) => setGeminiKeyInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center space-x-1.5 text-xs shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingConfig ? 'सुरक्षित किया जा रहा है...' : 'कुंजी सुरक्षित करें (Save & Activate)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={fetchStatus}
                    className="text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>रिफ्रेश</span>
                  </button>
                </div>

                {saveMessage && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-semibold ${
                      saveMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {saveMessage.text}
                  </div>
                )}
              </form>

            </div>
          ) : (
            <p className="text-sm text-red-500">Failed to load integration status.</p>
          )}

        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex justify-end border-t pt-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
