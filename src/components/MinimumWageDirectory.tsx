'use client';

import React, { useState } from 'react';
import { STATUTORY_MINIMUM_WAGES, MinimumWageRecord } from '@/lib/minimumWages';
import { Scale, IndianRupee, MapPin, ShieldCheck, AlertCircle, ArrowRight, FileCheck, CheckCircle2 } from 'lucide-react';

interface MinimumWageDirectoryProps {
  onSelectRate?: (dailyRate: number, stateName: string) => void;
  onReportDispute?: (stateName: string, category: string) => void;
}

export default function MinimumWageDirectory({
  onSelectRate,
  onReportDispute,
}: MinimumWageDirectoryProps) {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('DELHI');
  const [selectedSkill, setSelectedSkill] = useState<'unskilled' | 'semiSkilled' | 'skilled' | 'highlySkilled'>('unskilled');

  const currentState = STATUTORY_MINIMUM_WAGES.find((s) => s.stateCode === selectedStateCode) || STATUTORY_MINIMUM_WAGES[0];
  const rateInfo = currentState.rates[selectedSkill];
  const hourlyBase = rateInfo.daily / 8;
  const overtimeRate = hourlyBase * 2; // 2x statutory rate

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Scale className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">
              वैधानिक न्यूनतम मजदूरी दरें (Statutory Minimum Wage Directory)
            </h2>
            <p className="text-xs text-indigo-200">
              वेतन संहिता 2019 (धारा 6, 7 व 8) के तहत राज्यवार आधिकारिक न्यूनतम वेतन दरें
            </p>
          </div>
        </div>
        <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full font-mono font-bold">
          CODE ON WAGES 2019
        </span>
      </div>

      {/* State Selector Tabs */}
      <div className="p-5 border-b border-slate-200 bg-slate-50">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-600" />
          अपना राज्य या केंद्रीय क्षेत्र चुनें (Select State / Region):
        </label>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {STATUTORY_MINIMUM_WAGES.map((st) => (
            <button
              key={st.stateCode}
              onClick={() => setSelectedStateCode(st.stateCode)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedStateCode === st.stateCode
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st.stateNameHindi}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-2 font-mono">
          राजपत्र संदर्भ: {currentState.gazetteRef} (संशोधन तिथि: {currentState.effectiveDate})
        </p>
      </div>

      {/* Main Grid: Skill Cards & Breakdown */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 4 Skill Level Cards */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">
            श्रमिक दक्षता श्रेणी चुनें (Skill Category):
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['unskilled', 'semiSkilled', 'skilled', 'highlySkilled'] as const).map((skillKey) => {
              const item = currentState.rates[skillKey];
              const isSelected = selectedSkill === skillKey;
              return (
                <div
                  key={skillKey}
                  onClick={() => setSelectedSkill(skillKey)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900 text-xs">{item.labelHindi}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">{item.label}</span>
                  </div>
                  <div className="text-xl font-black text-indigo-900">
                    ₹{item.daily} <span className="text-xs font-semibold text-slate-500">/ दिन (8 घंटे)</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    प्रति माह: <strong>₹{item.monthly.toLocaleString('en-IN')}</strong> (26 दिन)
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statutory Provisions */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 mt-4 text-xs">
            <span className="font-bold text-slate-800 flex items-center">
              <ShieldCheck className="w-4 h-4 text-indigo-600 mr-1.5" />
              इस राज्य के विशेष कानूनी प्रावधान:
            </span>
            <ul className="list-disc pl-5 text-slate-600 space-y-1 text-[11px]">
              {currentState.specialProvisions.map((prov, i) => (
                <li key={i}>{prov}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Statutory Rights Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-500/30 space-y-5">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider block">
              कानूनी वेतन गारंटी (Legal Guarantee)
            </span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              {rateInfo.labelHindi}
            </h4>
            <p className="text-xs text-slate-300">{currentState.stateNameHindi}</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
              <span className="text-slate-400">दैनिक अनिवार्य न्यूनतम वेतन:</span>
              <span className="text-2xl font-black text-amber-300">₹{rateInfo.daily}</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
              <span className="text-slate-400">प्रति घंटा मूल दर (Base/hr):</span>
              <span className="font-bold text-white text-sm">₹{hourlyBase.toFixed(2)}/hr</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
              <span className="text-slate-400">ओवरटाइम दर (धारा 14, 2x):</span>
              <span className="font-bold text-emerald-400 text-base">₹{overtimeRate.toFixed(2)}/hr</span>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-slate-400">मासिक कुल (26 कार्य दिवस):</span>
              <span className="font-black text-white text-lg">₹{rateInfo.monthly.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            {onSelectRate && (
              <button
                onClick={() => onSelectRate(rateInfo.daily, currentState.stateNameHindi)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
              >
                <IndianRupee className="w-3.5 h-3.5" />
                <span>इस दर से वेतन डायरी में गणना करें (Use in Diary)</span>
              </button>
            )}

            {onReportDispute && (
              <button
                onClick={() => onReportDispute(currentState.stateNameHindi, rateInfo.labelHindi)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>कम भुगतान की शिकायत दर्ज करें (Report Underpayment)</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
