'use client';

import React, { useState, useEffect } from 'react';
import {
  HardHat,
  ShieldCheck,
  QrCode,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Download,
  CheckCircle,
  Sparkles,
  Save,
  Search,
  RefreshCw,
  Printer,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function WorkerCard() {
  const [name, setName] = useState('रमेश कुमार (Ramesh Kumar)');
  const [phone, setPhone] = useState('9876543210');
  const [trade, setTrade] = useState('भवन निर्माण मिस्त्री (Mason)');
  const [state, setState] = useState('उत्तर प्रदेश (Uttar Pradesh)');
  const [uan, setUan] = useState('UAN-9843-1204-5512');
  const [dailyWage, setDailyWage] = useState('650');

  // Search & Sync State
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Search existing worker by phone
  const handleSearch = async () => {
    if (!searchPhone.trim()) return;
    setSearching(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch(`/api/workers?phone=${encodeURIComponent(searchPhone.trim())}`);
      const data = await res.json();
      if (data.success && data.worker) {
        setName(data.worker.name);
        setPhone(data.worker.phone || '');
        setTrade(data.worker.occupation || 'असंगठित श्रमिक');
        setState(data.worker.state || 'भारत');
        setDailyWage(data.worker.dailyWage ? String(data.worker.dailyWage) : '650');
        if (data.worker.eShramCardNumber) setUan(data.worker.eShramCardNumber);
        setFeedbackMsg('श्रमिक रिकॉर्ड सफलतापूर्वक लोड हुआ!');
      } else {
        setFeedbackMsg('इस नंबर से कोई रिकॉर्ड नहीं मिला। आप नया कार्ड बना सकते हैं।');
      }
    } catch (e) {
      console.error(e);
      setFeedbackMsg('खोज के दौरान त्रुटि हुई।');
    } finally {
      setSearching(false);
    }
  };

  // Save to database
  const handleSaveToDatabase = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          occupation: trade.trim(),
          state: state.trim(),
          dailyWage: parseFloat(dailyWage) || 650,
          eShramCardNumber: uan.trim(),
          language: 'hi',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setFeedbackMsg('डिजिटल श्रमिक स्मार्ट कार्ड डेटाबेस में सुरक्षित हो गया!');
        setTimeout(() => setSaveSuccess(false), 5000);
      } else {
        setFeedbackMsg(data.error || 'सुरक्षित करने में विफलता।');
      }
    } catch (e) {
      console.error(e);
      setFeedbackMsg('डेटाबेस कनेक्शन त्रुटि।');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUan = () => {
    navigator.clipboard.writeText(uan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h2 className="font-bold text-base">डिजिटल श्रमिक पहचान व ई-श्रम स्मार्ट कार्ड</h2>
            <p className="text-xs text-amber-100">
              वैधानिक अधिकारों, 2x ओवरटाइम गारंटी एवं आपातकालीन 14434 क्यूआर कोड से लैस स्मार्ट कार्ड
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-black/25 text-amber-200 px-3 py-1 rounded-full font-mono font-semibold border border-amber-300/30">
            PRISMA PERSISTED
          </span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Customization & Database Sync */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Quick Search Worker Profile */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block flex items-center">
              <Search className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
              मोबाइल नंबर से खोजें (Search Existing Profile)
            </span>
            <div className="flex space-x-2">
              <input
                type="tel"
                placeholder="उदा. 9876543210"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="flex-1 border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={searching}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
              >
                <Search className={`w-3.5 h-3.5 ${searching ? 'animate-spin' : ''}`} />
                <span>{searching ? '...' : 'खोजें'}</span>
              </button>
            </div>
          </div>

          <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center">
            <Sparkles className="w-4 h-4 text-orange-600 mr-1.5" />
            स्मार्ट कार्ड विवरण अनुकूलित करें (Customize Card)
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                श्रमिक का नाम (Full Name)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  मोबाइल नंबर (Phone)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  मानक दैनिक वेतन (₹/दिन)
                </label>
                <input
                  type="number"
                  value={dailyWage}
                  onChange={(e) => setDailyWage(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold text-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                पेशा / ट्रेड (Occupation / Skill)
              </label>
              <input
                type="text"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                राज्य व जिला (State & Region)
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                ई-श्रम UAN नंबर (e-Shram Universal Account Number)
              </label>
              <input
                type="text"
                value={uan}
                onChange={(e) => setUan(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold tracking-wider"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSaveToDatabase}
              disabled={saving}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
            >
              <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
              <span>{saving ? 'सुरक्षित हो रहा है...' : 'डेटाबेस में सेव करें (Save to DB)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट / PDF डाउनलोड</span>
            </button>
          </div>

          {feedbackMsg && (
            <div className={`p-2.5 rounded-xl text-xs font-semibold ${
              saveSuccess ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {feedbackMsg}
            </div>
          )}
        </div>

        {/* Right Preview: High-End Smart Card */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-md bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 shadow-2xl border-2 border-amber-500/50 relative overflow-hidden group">
            {/* Background Holographic Glow & Grid */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Micro-chip & Emblem Bar */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/30">
                  <HardHat className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight text-white leading-tight">
                    श्रम साथी डिजिटल श्रमिक कार्ड
                  </h4>
                  <span className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase">
                    Sovereign Indian Worker ID
                  </span>
                </div>
              </div>

              {/* Holographic Chip */}
              <div className="flex items-center space-x-1.5">
                <div className="w-7 h-5 rounded bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 border border-amber-500/50 shadow-inner flex items-center justify-center">
                  <div className="w-4 h-3 border border-amber-800/40 rounded-sm"></div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[9px] font-mono font-bold">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="grid grid-cols-12 gap-4 items-center relative z-10 mb-4">
              <div className="col-span-8 space-y-2.5">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">
                    नाम / Full Name:
                  </span>
                  <span className="text-base font-black text-white tracking-wide block">
                    {name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">
                      पेशा / Trade:
                    </span>
                    <span className="text-amber-200 font-bold block">{trade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">
                      मानक वेतन / Wage:
                    </span>
                    <span className="text-emerald-400 font-black block">₹{dailyWage}/दिन</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">
                      फोन / Phone:
                    </span>
                    <span className="text-slate-200 font-mono font-semibold">{phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">
                      राज्य / State:
                    </span>
                    <span className="text-slate-200 text-xs truncate block">{state}</span>
                  </div>
                </div>
              </div>

              {/* QR Code and Helpline */}
              <div className="col-span-4 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl">
                <QrCode className="w-16 h-16 text-amber-300 mb-1" />
                <span className="text-[8px] font-mono text-slate-300 text-center leading-tight">
                  श्रम साथी QR
                </span>
                <span className="text-[9px] font-bold text-orange-400 font-mono mt-0.5">
                  हेल्पलाइन 14434
                </span>
              </div>
            </div>

            {/* UAN & Legal Guarantee footer */}
            <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[11px] relative z-10">
              <div className="flex items-center space-x-1.5">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-mono">
                    e-Shram UAN:
                  </span>
                  <span className="font-mono text-amber-400 font-bold tracking-wider">
                    {uan}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUan}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Copy UAN"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center text-emerald-400 font-bold text-[10px] space-x-1 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>2x ओवरटाइम गारंटी (धारा 14)</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-3 max-w-sm">
            यह स्मार्ट कार्ड असंगठित कर्मकार सामाजिक सुरक्षा अधिनियम एवं मजदूरी संहिता 2019 के अंतर्गत अधिकारों का आधिकारिक डिजिटल प्रमाण है।
          </p>
        </div>
      </div>
    </div>
  );
}
