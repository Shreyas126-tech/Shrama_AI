'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  X,
  CheckCircle2,
  Volume2,
  ShieldCheck,
  HardHat,
  Sparkles,
  Video,
  Award,
  Calculator,
  AlertOctagon,
  Scale,
  CreditCard,
  Share2,
  Copy,
  Check
} from 'lucide-react';

interface InteractiveMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InteractiveMediaModal({ isOpen, onClose }: InteractiveMediaModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const timerRef = useRef<any>(null);

  const steps = [
    {
      title: 'चरण 1: बहुभाषी वॉयस AI (Gnani Timbre v3.0)',
      time: '0:05',
      icon: Volume2,
      tag: 'VOICE AI ENGINE',
      desc: 'श्रमिक अपनी मातृभाषा (हिन्दी, ಕನ್ನಡ, తెలుగు, தமிழ்) में माइक दबाकर प्रश्न पूछते हैं। Gnani.ai Timbre v3.0 प्राकृतिक स्थानीय उच्चारण में उत्तर बोलकर सुनाता है।',
      badge: 'Gnani Timbre v3.0 (Shivani/Chetana)',
      highlight: 'प्राकृतिक भारतीय भाषाओं में 100% वॉयस इंटरैक्शन',
    },
    {
      title: 'चरण 2: न्यूनतम मजदूरी डायरेक्टरी (Statutory Wage Rates)',
      time: '0:12',
      icon: Scale,
      tag: 'MINIMUM WAGE DIRECTORY',
      desc: 'दिल्ली, महाराष्ट्र, कर्नाटक, तमिलनाडु, यूपी और केंद्रीय क्षेत्र की न्यूनतम मजदूरी दरें (अकुशल, अर्ध-कुशल, कुशल) का लाइव और पारदर्शी विवरण।',
      badge: 'State & Central Gazette Grounded',
      highlight: 'स्थान व कौशल के अनुसार न्यूनतम वेतन की त्वरित जांच',
    },
    {
      title: 'चरण 3: मजदूरी डायरी व 2x ओवरटाइम (Code on Wages Sec 14)',
      time: '0:20',
      icon: Calculator,
      tag: 'SECTION 14 GUARANTEE',
      desc: '8 घंटे से अधिक कार्य पर साधारण दर से दोगुना (2x) ओवरटाइम की स्वचालित गणना। कानूनी वेतन पर्ची डाउनलोड करें जो अदालत में साक्ष्य योग्य है।',
      badge: 'Code on Wages 2019 Sec 14',
      highlight: 'दोगुना ओवरटाइम वेतन का डिजिटल साक्ष्य',
    },
    {
      title: 'चरण 4: डिजिटल श्रमिक स्मार्ट कार्ड (Worker Smart ID)',
      time: '0:28',
      icon: CreditCard,
      tag: 'DIGITAL IDENTITY',
      desc: 'e-Shram UAN नंबर, व्यापार, आपातकालीन संपर्क और 14434 क्यूआर कोड से लैस सरकारी प्रारूप का डिजिटल वर्कर स्मार्ट कार्ड प्रिंट करें।',
      badge: 'Prisma SQLite Sync',
      highlight: 'पहचान, सुरक्षा और हेल्पलाइन क्यूआर कोड एक साथ',
    },
    {
      title: 'चरण 5: कल्याणकारी योजना खोजक (e-Shram & PM-SYM)',
      time: '0:35',
      icon: Award,
      tag: 'DBT SCHEMES',
      desc: 'ई-श्रम ₹2 लाख दुर्घटना कवर, पीएम-श्रम योगी मानधन ₹3000 मासिक पेंशन और बीओसीडब्ल्यू निर्माण श्रमिक आवास सहायता की सीधी पात्रता जांच।',
      badge: 'Direct Benefit Transfer Portal',
      highlight: 'बिना बिचौलियों के सरकारी योजनाओं का लाभ',
    },
    {
      title: 'चरण 6: कानूनी शिकायत निवारण व हेल्पलाइन 14434',
      time: '0:45',
      icon: AlertOctagon,
      tag: 'LEGAL REDRESSAL',
      desc: 'मजदूरी रुकने पर सहायक श्रमायुक्त (ALC) के नाम औपचारिक विधिक शिकायत पत्र का तत्काल निर्माण एवं राष्ट्रीय हेल्पलाइन 14434 पर 1-क्लिक कॉल।',
      badge: 'Formal ALC Complaint Notice',
      highlight: 'मजदूरी चोरी के खिलाफ वैधानिक नोटिस व सहायता',
    },
  ];

  // Auto-play steps simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 5000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps.length]);

  if (!isOpen) return null;

  const current = steps[currentStep];
  const StepIcon = current.icon;

  const handleCopyPitch = () => {
    const pitch = `🚀 Proud to build SHRAMA SATHI AI (श्रम साथी AI) for Indian workers! Powered by Gnani.ai Timbre v3.0 TTS, Evon LLM, and grounded in Indian Labour Law (Code on Wages 2019 Section 14 2x Overtime guarantee). Built with Next.js 14, TypeScript & Prisma ORM. #GnaniAI #IndianWorkers #VoiceAI #NextJS #AIforGood`;
    navigator.clipboard.writeText(pitch);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-orange-500/30 flex flex-col my-6">
        
        {/* Top Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Video className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  श्रम साथी AI • Interactive Feature Walkthrough
                </h3>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-400/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  LinkedIn Demo Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gnani.ai Timbre v3.0 & Labour Code Grounding Demonstration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950 flex flex-col justify-between p-6 sm:p-8 overflow-hidden">
          {/* Animated Glow Elements */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Bar on Video */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-mono bg-orange-600/90 text-white px-3.5 py-1 rounded-full border border-orange-400/40 font-bold flex items-center shadow-md">
              <HardHat className="w-3.5 h-3.5 mr-1.5" />
              {current.badge}
            </span>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-black/40 px-3 py-1 rounded-full border border-white/10">
              <span className="text-amber-400 font-bold">{current.tag}</span>
              <span>•</span>
              <span>{current.time}</span>
            </div>
          </div>

          {/* Center Graphic Animation */}
          <div className="relative z-10 my-auto text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-xl shadow-orange-500/30 ring-4 ring-orange-500/30 transform hover:scale-105 transition-all">
              <StepIcon className="w-10 h-10 text-slate-950" />
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {current.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/70 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
              {current.desc}
            </p>

            <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-semibold">
              ✨ {current.highlight}
            </div>
          </div>

          {/* Bottom Video Controls */}
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 rounded-2xl bg-orange-600 hover:bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/30 transition-all transform active:scale-95"
                title={isPlaying ? 'Pause Presentation' : 'Play Presentation'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div className="flex space-x-1.5 ml-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      currentStep === i
                        ? 'w-8 bg-gradient-to-r from-orange-500 to-amber-400'
                        : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Step ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors"
              >
                पिछला (Prev)
              </button>
              <button
                disabled={currentStep === steps.length - 1}
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 disabled:opacity-30 shadow-md transition-colors"
              >
                अगला (Next)
              </button>
            </div>
          </div>
        </div>

        {/* LinkedIn Showcase Post Helper Bar */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Share2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <span>
              <strong>LinkedIn Demo Tip:</strong> Record with <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">Win + Alt + R</code> or Chrome Extension
            </span>
          </div>

          <button
            onClick={handleCopyPitch}
            className="flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-500 text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-md text-xs whitespace-nowrap"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'पोस्ट टेक्स्ट कॉपी हुआ!' : 'LinkedIn पोस्ट टेक्स्ट कॉपी करें'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
