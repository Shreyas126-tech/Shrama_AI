'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  CheckCircle,
  Play,
  Pause,
  FastForward,
  Copy,
  Trash2,
  Download,
  ShieldCheck,
  Check
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isSimulatedFallback?: boolean;
  modelUsed?: string;
  audioBase64?: string;
  contentType?: string;
  timestamp: string;
}

interface VoiceChatAssistantProps {
  currentLang: string;
}

const SAMPLE_QUESTIONS_BY_LANG: Record<string, string[]> = {
  hi: [
    'न्यूनतम मजदूरी (Minimum Wage) कितनी होनी चाहिए?',
    '8 घंटे से ज्यादा काम करने पर 2x ओवरटाइम नियम क्या है?',
    'ठेकेदार पैसे नहीं दे रहा, धारा 15 में क्या करें?',
    'ई-श्रम (e-Shram) कार्ड के क्या फायदे हैं?',
  ],
  kn: [
    'ಕನಿಷ್ಠ ವೇತನ ದರಗಳು ಎಷ್ಟು ಇರಬೇಕು?',
    '8 ಗಂಟೆಗಿಂತ ಹೆಚ್ಚು ಕೆಲಸ ಮಾಡಿದರೆ ಓವರ್‌ಟೈಮ್ ನಿಯಮ ಏನು?',
    'ಇ-ಶ್ರಮ್ ಕಾರ್ಡ್ ನೋಂದಣಿ ಹೇಗೆ ಮಾಡುವುದು?',
    'ವೇತನ ನೀಡದ ಗುತ್ತಿಗೆದಾರನ ವಿರುದ್ಧ ದೂರು ನೀಡುವುದು ಹೇಗೆ?',
  ],
  te: [
    'కనీస వేతనం ఎంత ఉండాలి?',
    '8 గంటల కంటే ఎక్కువ పనికి 2 రెట్లు ఓవర్‌టైమ్ చట్టం ఏమిటి?',
    'ఈ-శ్రమ్ కార్డు ప్రయోజనాలు ఏమిటి?',
    'యజమాని వేతనం చెల్లించకపోతే ఎలా ఫిర్యాదు చేయాలి?',
  ],
  ta: [
    'குறைந்தபட்ச ஊதியம் எவ்வளவு இருக்க வேண்டும்?',
    '8 மணி நேரத்திற்கு மேல் வேலை செய்தால் 2x ஓவர்டைம் சட்டம் என்ன?',
    'இ-ஷ்ராம் அட்டை நன்மைகள் என்ன?',
    'கூலி தராவிட்டால் புகார் செய்வது எப்படி?',
  ],
  mr: [
    'किमान वेतन (Minimum Wage) दर किती असावे?',
    '८ तासांपेक्षा जास्त कामासाठी २ पट ओव्हरटाईम नियम काय आहे?',
    'ई-श्रम कार्डाचे काय फायदे आहेत?',
    'कंत्राटदाराने पगार अडवला तर काय करावे?',
  ],
  bn: [
    'ন্যূনতম মজুরি আইন অনুযায়ী কত পাওয়া উচিত?',
    '৮ ঘণ্টার বেশি কাজের জন্য ২ গুণ ওভারটাইমের নিয়ম কী?',
    'ই-শ্রম কার্ডের সুবিধা কী কী?',
    'মালিক মজুরি না দিলে কোথায় অভিযোগ করবেন?',
  ],
  en: [
    'What is statutory minimum wage for construction?',
    'What is 2x overtime pay rule under Section 14?',
    'How do I file a wage theft complaint?',
    'What benefits come with an e-Shram card?',
  ],
};

export default function VoiceChatAssistant({ currentLang }: VoiceChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'नमस्ते! मैं श्रम साथी हूँ। मैं न्यूनतम मजदूरी, 8 घंटे कार्य समय, दोगुना (2x) ओवरटाइम भुगतान (धारा 14), ई-श्रम कार्ड और कानूनी सुरक्षा से संबंधित आपके प्रश्नों का उत्तर देने के लिए तैयार हूँ। आप माइक दबाकर अपनी भाषा में बोल सकते हैं या नीचे लिख सकते हैं।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLang === 'en' ? 'en-IN' : `${currentLang}-IN`;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
          // Auto send recognized speech
          sendMessage(transcript, 'VOICE');
        };

        recognition.onerror = (err: any) => {
          console.error('Speech recognition error:', err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechRecognitionSupported(false);
      }
    }
  }, [currentLang]);

  // Toggle voice recording
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = currentLang === 'en' ? 'en-IN' : `${currentLang}-IN`;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  // Play synthesized audio with Gnani Timbre
  const playAudio = async (text: string, base64Audio?: string, mimeType?: string, index?: number) => {
    // If already speaking the same message, stop playback
    if (isSpeaking && currentlyPlayingIndex === index) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setCurrentlyPlayingIndex(null);
      return;
    }

    // Stop existing playback first
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (index !== undefined) setCurrentlyPlayingIndex(index);
    setIsSpeaking(true);

    // 1. If Timbre returned live audio base64, play it
    if (base64Audio) {
      try {
        const type = mimeType || 'audio/wav';
        const audio = new Audio(`data:${type};base64,${base64Audio}`);
        audio.playbackRate = audioSpeed;
        audioPlayerRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          setCurrentlyPlayingIndex(null);
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          setCurrentlyPlayingIndex(null);
        };
        await audio.play();
        return;
      } catch (e) {
        console.error('Error playing base64 audio:', e);
      }
    }

    // 2. Request Timbre TTS synthesis server-side
    try {
      const timbreRes = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: currentLang, speed: audioSpeed }),
      });
      const timbreData = await timbreRes.json();

      if (timbreData.success && timbreData.audioBase64) {
        const type = timbreData.contentType || 'audio/wav';
        const audio = new Audio(`data:${type};base64,${timbreData.audioBase64}`);
        audio.playbackRate = audioSpeed;
        audioPlayerRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          setCurrentlyPlayingIndex(null);
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          setCurrentlyPlayingIndex(null);
        };
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('Timbre API call notice:', e);
    }

    // 3. Graceful client fallback using Web Speech Synthesis API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'en' ? 'en-IN' : `${currentLang}-IN`;
      utterance.rate = audioSpeed;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingIndex(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingIndex(null);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
      setCurrentlyPlayingIndex(null);
    }
  };

  // Send message
  const sendMessage = async (textToSend?: string, modality: 'TEXT' | 'VOICE' = 'TEXT') => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language: currentLang,
          modality,
        }),
      });

      const data = await res.json();

      const replyContent = data.text || 'उत्तर प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।';
      const assistantMessage: Message = {
        role: 'assistant',
        content: replyContent,
        isSimulatedFallback: data.isSimulatedFallback,
        modelUsed: data.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If spoken by voice, speak response automatically with Timbre
      if (modality === 'VOICE') {
        const newIndex = updatedMessages.length;
        playAudio(replyContent, undefined, undefined, newIndex);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'क्षमा करें, सर्वर से संपर्क स्थापित नहीं हो सका। कृपया अपनी इंटरनेट कनेक्टिविटी जांचें।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'नमस्ते! मैं श्रम साथी हूँ। वार्तालाप रीसेट कर दिया गया है। आप अपना नया प्रश्न पूछ सकते हैं।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const sampleQuestions = SAMPLE_QUESTIONS_BY_LANG[currentLang] || SAMPLE_QUESTIONS_BY_LANG['hi'];

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col h-[700px]">
      {/* Assistant Header with Mascot Avatar & Equalizer */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-4 text-white flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-orange-500/50 shadow-md shadow-orange-500/20 bg-slate-900 flex-shrink-0 relative">
            <img
              src="/images/avatar_sathi.jpg"
              alt="Avatar Sathi"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {isSpeaking && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-ping"></span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-base text-white tracking-tight">
                श्रम साथी वॉयस व चैट सहायक
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                Gnani Timbre & Evon
              </span>
            </div>
            <p className="text-xs text-slate-400">
              श्रमिक अधिकारों और कानूनी सुरक्षा के लिए बहुभाषी संवादात्मक AI
            </p>
          </div>
        </div>

        {/* Live Equalizer & Controls */}
        <div className="flex items-center space-x-3">
          {/* Animated Equalizer when speaking */}
          {isSpeaking && (
            <div className="flex items-center space-x-2 bg-orange-950/80 border border-orange-500/60 px-3 py-1 rounded-full shadow-lg">
              <div className="flex items-end space-x-0.5 h-4">
                <span className="w-1 bg-amber-400 rounded-full eq-bar-1"></span>
                <span className="w-1 bg-orange-400 rounded-full eq-bar-2"></span>
                <span className="w-1 bg-yellow-400 rounded-full eq-bar-3"></span>
                <span className="w-1 bg-amber-300 rounded-full eq-bar-4"></span>
                <span className="w-1 bg-orange-500 rounded-full eq-bar-5"></span>
              </div>
              <span className="text-amber-300 text-xs font-bold font-mono">वाक् जारी...</span>
            </div>
          )}

          {/* Speed Toggle */}
          <div className="hidden sm:flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-xl text-xs font-mono border border-white/10">
            <span className="text-slate-400 text-[10px]">गति:</span>
            {[0.8, 1.0, 1.25].map((spd) => (
              <button
                key={spd}
                onClick={() => setAudioSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  audioSpeed === spd ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Reset History */}
          <button
            onClick={handleClearHistory}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
            title="वार्तालाप साफ करें (Clear History)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
        {messages.map((msg, index) => {
          const isMsgPlaying = isSpeaking && currentlyPlayingIndex === index;
          return (
            <div
              key={index}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-end space-x-2 max-w-[88%] sm:max-w-[80%]">
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow ring-1 ring-orange-300 bg-slate-900">
                    <img
                      src="/images/avatar_sathi.jpg"
                      alt="Sathi"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm relative group ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}

                  {/* Assistant Meta Badge & Audio Actions */}
                  {msg.role === 'assistant' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-[10px] text-slate-500 font-semibold truncate max-w-[150px]">
                        {msg.modelUsed || 'Evon Intelligence Engine'}
                      </span>

                      <div className="flex items-center space-x-1.5 ml-2">
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopyMessage(msg.content, index)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
                          title="कॉपी करें (Copy)"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Timbre Play / Pause Button */}
                        <button
                          onClick={() => playAudio(msg.content, msg.audioBase64, msg.contentType, index)}
                          className={`flex items-center space-x-1 font-semibold px-2.5 py-1 rounded-lg transition-colors text-xs ${
                            isMsgPlaying
                              ? 'bg-orange-600 text-white'
                              : 'bg-orange-50 hover:bg-orange-100 text-orange-700'
                          }`}
                          title="Listen with Timbre TTS voice"
                        >
                          {isMsgPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>रोकें</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                              <span>सुनें (Listen)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center flex-shrink-0 text-xs shadow">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-10">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs pl-2 bg-white/60 p-2.5 rounded-xl border border-orange-100 w-fit">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-bounce"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-bounce delay-100"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-bounce delay-200"></div>
            <span className="font-semibold text-slate-700">श्रम साथी सोच रहा है...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Pills */}
      <div className="px-4 py-2.5 bg-slate-100/90 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-600 font-bold text-[11px] flex-shrink-0 flex items-center">
          <Sparkles className="w-3.5 h-3.5 text-orange-600 mr-1" />
          शीघ्र प्रश्न:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q, 'TEXT')}
            className="flex-shrink-0 bg-white hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-slate-700 border border-slate-300 px-3 py-1 rounded-full transition-all font-medium shadow-2xs text-xs whitespace-nowrap active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center space-x-2"
        >
          {/* Big Vernacular Microphone Button with Pulsing Wave */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center flex-shrink-0 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse-ring'
                : 'bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white active:scale-95'
            }`}
            title={
              isListening
                ? 'सुनना बंद करें (Click to stop)'
                : 'बोलकर पूछें (Click to speak via Gnani Timbre voice interface)'
            }
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'सुन रहा हूँ... बोलिए (Listening...)'
                : 'अपना प्रश्न यहाँ लिखें या माइक दबाकर बोलें...'
            }
            className="flex-1 bg-slate-100 border border-slate-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 transition-all font-medium"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-2xl shadow-md transition-all active:scale-95 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 mt-2.5 px-1 gap-1">
          <span className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1 flex-shrink-0" />
            वैधानिक संदर्भ: वेतन संहिता 2019 (धारा 14 2x ओवरटाइम) व 4 श्रम संहिताएं
          </span>
          <span className="font-mono text-orange-600 font-bold flex items-center">
            हेल्पलाइन: 14434
          </span>
        </div>
      </div>
    </div>
  );
}
