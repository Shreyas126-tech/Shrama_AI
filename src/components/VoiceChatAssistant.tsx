'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, AlertCircle, Bot, User, CheckCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isSimulatedFallback?: boolean;
  modelUsed?: string;
  audioBase64?: string;
  timestamp: string;
}

interface VoiceChatAssistantProps {
  currentLang: string;
}

export default function VoiceChatAssistant({ currentLang }: VoiceChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'नमस्ते! मैं श्रम साथी हूँ। मैं न्यूनतम मजदूरी, काम के घंटे, ओवरटाइम भुगतान, ई-श्रम कार्ड और कार्यस्थल अधिकारों से संबंधित आपके प्रश्नों का उत्तर दे सकता हूँ। आप माइक दबाकर बोल सकते हैं या नीचे लिख सकते हैं।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll
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

  // Play synthesized audio
  const playAudio = async (text: string, base64Audio?: string) => {
    if (isSpeaking) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    // 1. If Timbre returned live audio base64, play it
    if (base64Audio) {
      try {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audioPlayerRef.current = audio;
        setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
        return;
      } catch (e) {
        console.error('Error playing base64 audio:', e);
      }
    }

    // 2. Or request Timbre TTS synthesis server-side
    try {
      const timbreRes = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: currentLang }),
      });
      const timbreData = await timbreRes.json();

      if (timbreData.success && timbreData.audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${timbreData.audioBase64}`);
        audioPlayerRef.current = audio;
        setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
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
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
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

      // If spoken by voice, speak response automatically
      if (modality === 'VOICE') {
        playAudio(replyContent);
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

  // Quick suggestion pills
  const sampleQuestions = [
    'न्यूनतम मजदूरी (Minimum Wage) कितनी होनी चाहिए?',
    'ठेकेदार 2 महीने से पैसे नहीं दे रहा, क्या करें?',
    'ई-श्रम (e-Shram) कार्ड के क्या फायदे हैं?',
    '8 घंटे से ज्यादा काम करने पर ओवरटाइम का क्या नियम है?',
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden flex flex-col h-[650px]">
      {/* Assistant Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-base">श्रम साथी वॉयस व चैट सहायक</h2>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                Evon + Timbre Ready
              </span>
            </div>
            <p className="text-xs text-orange-100">
              श्रमिक अधिकारों और कानूनी सुरक्षा के लिए तत्काल सहायता
            </p>
          </div>
        </div>

        {isSpeaking && (
          <div className="flex items-center space-x-1 text-xs bg-black/20 px-3 py-1 rounded-full animate-pulse">
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span className="text-amber-200 text-xs">ध्वनि उच्चारण जारी...</span>
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-end space-x-2 max-w-[85%]">
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-orange-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {msg.content}

                {/* Additional Assistant Meta Badge */}
                {msg.role === 'assistant' && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-[10px]">
                      {msg.modelUsed || 'Evon Intelligence'}
                    </span>
                    <button
                      onClick={() => playAudio(msg.content, msg.audioBase64)}
                      className="text-orange-600 hover:text-orange-700 flex items-center space-x-1 font-semibold ml-2"
                      title="Listen with Timbre TTS"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>सुनें (Listen)</span>
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center flex-shrink-0 text-xs shadow">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-9">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs pl-2">
            <div className="w-2 h-2 rounded-full bg-orange-600 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-200"></div>
            <span className="text-slate-500">श्रम साथी सोच रहा है...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Pills */}
      <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-500 font-semibold text-[11px] flex-shrink-0">
          सुझाव:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q, 'TEXT')}
            className="flex-shrink-0 bg-white hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-slate-700 border border-slate-300 px-3 py-1 rounded-full transition-colors font-medium shadow-2xs"
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
          {/* Big Vernacular Microphone Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center ${
              isListening
                ? 'bg-red-600 text-white animate-pulse-ring'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
            title={
              isListening
                ? 'सुनना बंद करें (Click to stop)'
                : 'बोलकर पूछें (Click to speak via Timbre voice interface)'
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
            className="flex-1 bg-slate-100 border border-slate-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 transition-all"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-3.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:hover:bg-orange-600 text-white rounded-2xl shadow-md transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>श्रम कानून संदर्भ: वेतन संहिता 2019 एवं सामाजिक सुरक्षा संहिता</span>
          <span className="font-mono text-emerald-600 font-semibold flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            प्रमाणीकृत वॉयस व टेक्स्ट मॉडल
          </span>
        </div>
      </div>
    </div>
  );
}

