'use client';

import React, { useState, useEffect } from 'react';
import { HardHat, Shield, Cpu, Mic, Database, PhoneCall, Sparkles, Volume2 } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import IntegrationStatusModal from './IntegrationStatusModal';

interface HeaderProps {
  currentLang: string;
  onSelectLanguage: (lang: string) => void;
}

export default function Header({ currentLang, onSelectLanguage }: HeaderProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [sysStatus, setSysStatus] = useState<{
    dbOk: boolean;
    evonOk: boolean;
    timbreOk: boolean;
    activeAi: string;
    model: string;
    voice: string;
  }>({
    dbOk: true,
    evonOk: false,
    timbreOk: false,
    activeAi: 'Statutory Rules',
    model: 'evon-v3.3',
    voice: 'Shivani',
  });

  const checkStatus = () => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setSysStatus({
          dbOk: Boolean(data?.integrations?.prisma?.connected),
          evonOk: Boolean(data?.integrations?.aiEngine?.configured),
          timbreOk: Boolean(data?.integrations?.timbre?.configured),
          activeAi: data?.integrations?.aiEngine?.activeProvider || 'Statutory Rules',
          model: data?.integrations?.aiEngine?.model || 'evon-v3.3',
          voice: data?.integrations?.timbre?.defaultVoice || 'Shivani',
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    checkStatus();
    // Periodically refresh status
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-orange-500/20 ring-2 ring-orange-500/60 flex-shrink-0 bg-slate-950 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src="/images/avatar_sathi.jpg"
                alt="Shrama Sathi AI Companion"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  श्रम साथी <span className="text-orange-600">AI</span>
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full border border-orange-300/60 shadow-2xs">
                  Shrama Sathi
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                  Gnani Timbre v3.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                भारतीय श्रमिक सहायता व बहुभाषी वॉयस साथी • Sovereign Labour & Welfare Portal
              </p>
            </div>
          </div>

          {/* Right actions: Helpline, Status Badges & Language Switcher */}
          <div className="flex items-center flex-wrap gap-2">
            {/* National Helpline 14434 Quick Call Pill */}
            <a
              href="tel:14434"
              className="flex items-center space-x-1.5 text-xs bg-rose-50 hover:bg-rose-100 text-rose-800 px-3 py-1.5 rounded-full border border-rose-200 transition-colors font-bold shadow-2xs"
              title="National Labour Helpline 14434"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>हेल्पलाइन: <span className="font-mono text-rose-900">14434</span></span>
            </a>

            {/* Architecture Status Modal Trigger */}
            <button
              onClick={() => setShowStatusModal(true)}
              className="flex items-center space-x-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full border border-slate-300/80 transition-all shadow-2xs"
              title="Click to view API, Timbre & Database integration status"
            >
              <div className="flex items-center space-x-1.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-slate-800 text-[11px] hidden sm:inline">Status:</span>
              </div>

              <div className="flex items-center space-x-1 font-mono text-[10px]">
                <span className={`px-1.5 py-0.5 rounded font-bold ${sysStatus.dbOk ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800'}`}>
                  Prisma
                </span>
                <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${sysStatus.evonOk ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
                  {sysStatus.activeAi}
                </span>
                <span className={`px-1.5 py-0.5 rounded font-bold flex items-center space-x-0.5 ${sysStatus.timbreOk ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'}`}>
                  <Volume2 className="w-2.5 h-2.5 mr-0.5 text-emerald-700" />
                  <span>Timbre {sysStatus.timbreOk ? 'READY' : 'PENDING'}</span>
                </span>
              </div>
            </button>

            {/* Language Selector */}
            <LanguageSelector
              currentLang={currentLang}
              onSelectLanguage={onSelectLanguage}
            />
          </div>
        </div>
      </header>

      <IntegrationStatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          checkStatus();
        }}
      />
    </>
  );
}
