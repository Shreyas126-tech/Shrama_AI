'use client';

import React, { useState } from 'react';
import { Play, Pause, X, CheckCircle2, Volume2, ShieldCheck, HardHat, Sparkles } from 'lucide-react';

interface InteractiveMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InteractiveMediaModal({ isOpen, onClose }: InteractiveMediaModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'चरण 1: बहुभाषी वॉयस इनपुट (Multilingual Voice Input)',
      time: '0:05',
      desc: 'श्रमिक अपनी स्थानीय भाषा (हिन्दी, ಕನ್ನಡ, తెలుగు, தமிழ்) में माइक दबाकर प्रश्न पूछते हैं। Gnani.ai Timbre वॉयस इंजन प्राकृतिक उच्चारण समझता है।',
      badge: 'Gnani Timbre Voice Engine',
    },
    {
      title: 'चरण 2: 4 श्रम संहिताओं से सत्यापित AI उत्तर (Evon LLM Grounding)',
      time: '0:12',
      desc: 'Evon LLM और वैधानिक इंजन तुरंत उत्तर देते हैं: 8 घंटे से अधिक कार्य पर धारा 14 के तहत दोगुना (2x) ओवरटाइम भुगतान अनिवार्य है।',
      badge: 'Code on Wages 2019 Sec 14',
    },
    {
      title: 'चरण 3: स्वचालित मजदूरी पर्ची व ई-श्रम सत्यापन (Digital Wage Diary)',
      time: '0:20',
      desc: 'सिस्टम पारदर्शी वेतन पर्ची तैयार करता है, जिसे सबूत के तौर पर डाउनलोड किया जा सकता है और श्रम आयुक्त के पास दर्ज किया जा सकता है।',
      badge: 'Legal Evidence Ready',
    },
    {
      title: 'चरण 4: राष्ट्रीय श्रम हेल्पलाइन 14434 से त्वरित जोड़ (Direct Redressal)',
      time: '0:28',
      desc: 'यदि ठेकेदार वेतन रोकता है, तो एक क्लिक में राष्ट्रीय श्रम हेल्पलाइन 14434 पर कॉल और श्रम सुविधा पोर्टल पर शिकायत दर्ज होती है।',
      badge: 'Helpline 14434 Direct',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                श्रम साथी AI कैसे काम करता है? • Interactive Video Presentation
              </h3>
              <p className="text-[11px] text-slate-400">
                Sovereign Multilingual Worker Intelligence Demonstration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950 flex flex-col justify-between p-6 overflow-hidden">
          {/* Animated Background Audio Waves */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-96 h-96 rounded-full bg-orange-500 blur-3xl animate-pulse"></div>
          </div>

          {/* Top Overlay Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-mono bg-orange-600/80 text-white px-3 py-1 rounded-full border border-orange-400/40 font-bold flex items-center">
              <HardHat className="w-3.5 h-3.5 mr-1" />
              {steps[currentStep].badge}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {steps[currentStep].time} / 0:30
            </span>
          </div>

          {/* Center Graphic Animation */}
          <div className="relative z-10 my-auto text-center space-y-4 max-w-xl mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/20 animate-bounce">
              <Volume2 className="w-10 h-10 text-slate-950" />
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {steps[currentStep].title}
            </h4>

            <p className="text-sm text-slate-300 leading-relaxed bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              {steps[currentStep].desc}
            </p>
          </div>

          {/* Bottom Controls */}
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-700 flex items-center justify-center text-white shadow-md"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="flex space-x-1.5 ml-3">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentStep === i ? 'w-8 bg-orange-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 disabled:opacity-30"
              >
                पिछला (Prev)
              </button>
              <button
                disabled={currentStep === steps.length - 1}
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-700 disabled:opacity-30"
              >
                अगला (Next)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Highlights Footer */}
        <div className="p-4 bg-slate-950 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-white/5">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>4 श्रम संहिताओं पर शत-प्रतिशत कानूनी सत्यापन</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>आपातकालीन सहायता:</span>
            <strong className="text-orange-400 font-mono">14434 (श्रमिक हेल्पलाइन)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

