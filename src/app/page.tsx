'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import VoiceChatAssistant from '@/components/VoiceChatAssistant';
import WageCalculator from '@/components/WageCalculator';
import SchemeFinder from '@/components/SchemeFinder';
import GrievanceTracker from '@/components/GrievanceTracker';
import WorkerCard from '@/components/WorkerCard';
import MinimumWageDirectory from '@/components/MinimumWageDirectory';
import InteractiveMediaModal from '@/components/InteractiveMediaModal';
import { TRANSLATIONS } from '@/lib/translations';
import {
  Bot,
  Calculator,
  Award,
  AlertOctagon,
  Sparkles,
  Shield,
  HeartHandshake,
  BookOpen,
  Play,
  CreditCard,
  Scale,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState('hi');
  const [activeTab, setActiveTab] = useState<'chat' | 'minwage' | 'wage' | 'card' | 'schemes' | 'grievance'>('chat');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['hi'];

  const tabs = [
    {
      id: 'chat' as const,
      label: t.tabs.chat.label,
      sublabel: t.tabs.chat.sub,
      icon: Bot,
      color: 'text-orange-500',
    },
    {
      id: 'minwage' as const,
      label: 'न्यूनतम मजदूरी दरें',
      sublabel: 'Statutory Wage Directory',
      icon: Scale,
      color: 'text-indigo-500',
    },
    {
      id: 'wage' as const,
      label: t.tabs.wage.label,
      sublabel: t.tabs.wage.sub,
      icon: Calculator,
      color: 'text-emerald-500',
    },
    {
      id: 'card' as const,
      label: 'डिजिटल श्रमिक कार्ड',
      sublabel: 'Smart Worker ID Card',
      icon: CreditCard,
      color: 'text-amber-500',
    },
    {
      id: 'schemes' as const,
      label: t.tabs.schemes.label,
      sublabel: t.tabs.schemes.sub,
      icon: Award,
      color: 'text-blue-500',
    },
    {
      id: 'grievance' as const,
      label: t.tabs.grievance.label,
      sublabel: t.tabs.grievance.sub,
      icon: AlertOctagon,
      color: 'text-rose-500',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentLang={currentLang}
        onSelectLanguage={(lang) => setCurrentLang(lang)}
      />

      {/* Modern Hero Showcase with AI-Generated Imagery & Video Tour */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-10 pb-12 border-b border-orange-500/20">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{t.sovereignBadge} • Gnani Timbre & Evon Stack</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                हर भारतीय श्रमिक का <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">सच्चा डिजिटल साथी</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <Bot className="w-4 h-4 text-slate-950" />
                  <span>वॉयस सहायक से बात करें (Start Voice Assistant)</span>
                </button>

                <button
                  onClick={() => setShowVideoModal(true)}
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all flex items-center space-x-2.5"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-slate-950 ml-0.5" />
                  </div>
                  <span>डेमो वीडियो देखें (Watch Demo Video)</span>
                </button>
              </div>

              {/* Statutory Guarantee Badges */}
              <div className="pt-3 grid grid-cols-3 gap-3 max-w-lg">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
                  <div className="text-lg font-black text-orange-400">4 संहिताओं</div>
                  <div className="text-[10px] text-slate-400 leading-tight">पर वैधानिक सत्यापन</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
                  <div className="text-lg font-black text-emerald-400">2x ओवरटाइम</div>
                  <div className="text-[10px] text-slate-400 leading-tight">धारा 14 गारंटी</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
                  <div className="text-lg font-black text-amber-300">7 भाषाएँ</div>
                  <div className="text-[10px] text-slate-400 leading-tight">प्राकृतिक वॉयस AI</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-orange-500/40 shadow-2xl shadow-orange-950/50 group bg-slate-950">
                {/* AI Generated Image */}
                <img
                  src="/images/hero_workers.jpg"
                  alt="Dignified Indian Workers empowered by Shrama Sathi AI"
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Floating Card Badges */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/15 text-white flex items-center justify-between shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-white">
                        असंगठित श्रमिक अधिकार कवच
                      </h4>
                      <p className="text-[10px] text-amber-300">
                        निशुल्क ई-श्रम, कानूनी सुरक्षा व 14434 सपोर्ट
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 shadow-md transition-all"
                    title="Play Presentation Video"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-800/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl max-w-full overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : tab.color}`} />
                    <div className="text-left">
                      <div>{tab.label}</div>
                      <div className={`text-[9px] font-normal ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
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

        {activeTab === 'minwage' && (
          <div>
            <MinimumWageDirectory
              onSelectRate={() => setActiveTab('wage')}
              onReportDispute={() => setActiveTab('grievance')}
            />
          </div>
        )}

        {activeTab === 'wage' && (
          <div>
            <WageCalculator />
          </div>
        )}

        {activeTab === 'card' && (
          <div>
            <WorkerCard />
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

      {/* Interactive Video / Presentation Modal */}
      <InteractiveMediaModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-orange-500 bg-slate-950 flex-shrink-0">
              <img
                src="/images/avatar_sathi.jpg"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">श्रम साथी AI (SHRAMA SATHI AI)</span>
              <span className="text-[11px] text-slate-400">{t.footer.tagline}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <span className="flex items-center text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-orange-400 mr-1.5" />
              {t.footer.helpline}: <strong className="text-orange-400 ml-1 font-mono text-sm">14434</strong>
            </span>
            <span>
              <a href="https://eshram.gov.in" target="_blank" rel="noreferrer" className="hover:text-white underline">
                {t.footer.eshram}
              </a>
            </span>
            <span>
              <a href="https://shramsuvidha.gov.in" target="_blank" rel="noreferrer" className="hover:text-white underline">
                {t.footer.shramsuvidha}
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
