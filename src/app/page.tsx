'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import VoiceChatAssistant from '@/components/VoiceChatAssistant';
import WageCalculator from '@/components/WageCalculator';
import SchemeFinder from '@/components/SchemeFinder';
import GrievanceTracker from '@/components/GrievanceTracker';
import { Bot, Calculator, Award, AlertOctagon, Sparkles, Shield, HeartHandshake, BookOpen } from 'lucide-react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState('hi');
  const [activeTab, setActiveTab] = useState<'chat' | 'wage' | 'schemes' | 'grievance'>('chat');

  const tabs = [
    {
      id: 'chat' as const,
      label: 'वॉयस व चैट साथी',
      sublabel: 'Voice Assistant',
      icon: Bot,
      color: 'text-orange-600',
    },
    {
      id: 'wage' as const,
      label: 'मजदूरी डायरी व ओवरटाइम',
      sublabel: 'Wage Diary & 2x Overtime',
      icon: Calculator,
      color: 'text-emerald-600',
    },
    {
      id: 'schemes' as const,
      label: 'सरकारी योजनाएं व लाभ',
      sublabel: 'e-Shram & Welfare Schemes',
      icon: Award,
      color: 'text-blue-600',
    },
    {
      id: 'grievance' as const,
      label: 'शिकायत निवारण केंद्र',
      sublabel: 'Grievance & Legal Help',
      icon: AlertOctagon,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentLang={currentLang}
        onSelectLanguage={(lang) => setCurrentLang(lang)}
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-orange-50 via-amber-50/40 to-slate-50 pt-8 pb-6 border-b border-orange-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 bg-orange-100/80 border border-orange-200 text-orange-900 px-3.5 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>सॉवरेन भारतीय श्रमिक इंटेलिजेंस • Sovereign Worker Intelligence</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              हर भारतीय श्रमिक का सच्चा डिजिटल साथी
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              भारतीय श्रम संहिताओं (Labour Codes) पर आधारित अपनी स्थानीय भाषा में निष्पक्ष कानूनी सलाह, न्यूनतम मजदूरी व ओवरटाइम गणना, ई-श्रम योजनाएं और शिकायत निवारण प्राप्त करें।
            </p>

            {/* Feature Stat Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700">
              <span className="flex items-center bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                <Shield className="w-3.5 h-3.5 text-orange-600 mr-1.5" />
                4 श्रम संहिताओं पर प्रमाणित
              </span>
              <span className="flex items-center bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                2x वैधानिक ओवरटाइम नियम
              </span>
              <span className="flex items-center bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                बहुभाषी वॉयस एवं टेक्स्ट सहायता
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex p-1.5 bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm max-w-full overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : tab.color}`} />
                    <div className="text-left">
                      <div>{tab.label}</div>
                      <div className={`text-[9px] font-normal ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        {tab.sublabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <VoiceChatAssistant currentLang={currentLang} />
          </div>
        )}

        {activeTab === 'wage' && (
          <div>
            <WageCalculator />
          </div>
        )}

        {activeTab === 'schemes' && (
          <div>
            <SchemeFinder />
          </div>
        )}

        {activeTab === 'grievance' && (
          <div>
            <GrievanceTracker />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-bold">
              SS
            </div>
            <span className="font-bold text-slate-800">श्रम साथी AI (SHRAMA SATHI AI)</span>
            <span>• असंगठित एवं संगठित भारतीय श्रमिकों का सशक्तिकरण</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <span>राष्ट्रीय श्रमिक हेल्पलाइन: <strong className="text-orange-700">14434</strong></span>
            <span>ई-श्रम पोर्टल: <a href="https://eshram.gov.in" target="_blank" rel="noreferrer" className="underline">eshram.gov.in</a></span>
            <span>श्रम सुविधा: <a href="https://shramsuvidha.gov.in" target="_blank" rel="noreferrer" className="underline">shramsuvidha.gov.in</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
