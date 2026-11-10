'use client';

import React, { useState, useEffect } from 'react';
import { HardHat, Shield, Cpu, Mic, Database } from 'lucide-react';
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
  }>({
    dbOk: true,
    evonOk: false,
    timbreOk: false,
  });

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setSysStatus({
          dbOk: Boolean(data?.integrations?.prisma?.connected),
          evonOk: Boolean(data?.integrations?.evon?.configured),
          timbreOk: Boolean(data?.integrations?.timbre?.configured),
        });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 ring-2 ring-orange-200">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  श्रम साथी <span className="text-orange-600">AI</span>
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-200">
                  Shrama Sathi
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                भारतीय श्रमिक सहायता व बहुभाषी वॉयस साथी • Indian Labour & Welfare Portal
              </p>
            </div>
          </div>

          {/* Right actions: Status badges + Language Switcher */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Status Button */}
            <button
              onClick={() => setShowStatusModal(true)}
              className="flex items-center space-x-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
              title="Click to view detailed API & Database architecture verification"
            >
              <div className="flex items-center space-x-1.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-slate-800">System Status:</span>
              </div>

              <div className="flex items-center space-x-1 font-mono text-[10px]">
                <span className={`px-1.5 py-0.5 rounded font-bold ${sysStatus.dbOk ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  Prisma
                </span>
                <span className={`px-1.5 py-0.5 rounded font-bold ${sysStatus.evonOk ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}>
                  Evon
                </span>
                <span className={`px-1.5 py-0.5 rounded font-bold ${sysStatus.timbreOk ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  Timbre
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
        onClose={() => setShowStatusModal(false)}
      />
    </>
  );
}
