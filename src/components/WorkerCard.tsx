'use client';

import React, { useState } from 'react';
import { HardHat, ShieldCheck, QrCode, Phone, MapPin, Briefcase, Award, Download, CheckCircle, Sparkles } from 'lucide-react';

export default function WorkerCard() {
  const [name, setName] = useState('रमेश कुमार (Ramesh Kumar)');
  const [phone, setPhone] = useState('9876543210');
  const [trade, setTrade] = useState('भवन निर्माण मिस्त्री (Mason)');
  const [state, setState] = useState('उत्तर प्रदेश (Uttar Pradesh)');
  const [uan, setUan] = useState('UAN-9843-1204-5512');
  const [dailyWage, setDailyWage] = useState('650');
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h2 className="font-bold text-base">डिजिटल श्रमिक पहचान व ई-श्रम स्मार्ट कार्ड</h2>
            <p className="text-xs text-amber-100">
              वैधानिक अधिकारों एवं आपातकालीन 14434 क्यूआर कोड से लैस डिजिटल वर्कर स्मार्ट कार्ड
            </p>
          </div>
        </div>
        <span className="text-xs bg-black/20 text-white px-3 py-1 rounded-full font-mono font-semibold">
          DIGITAL IDENTITY
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Form: Customization */}
        <div className="lg:col-span-5 space-y-4">
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
                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  मोबाइल नंबर (Phone)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  न्यूनतम दैनिक वेतन (₹)
                </label>
                <input
                  type="text"
                  value={dailyWage}
                  onChange={(e) => setDailyWage(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
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
                ई-श्रम UAN नंबर (e-Shram Number)
              </label>
              <input
                type="text"
                value={uan}
                onChange={(e) => setUan(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>स्मार्ट कार्ड प्रिंट / डाउनलोड (Print Card)</span>
            </button>
          </div>
        </div>

        {/* Right Preview: High-End Smart Card */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 shadow-2xl border-2 border-amber-500/40 relative overflow-hidden">
            {/* Background Holographic Glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-900 font-black shadow-md">
                  <HardHat className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight text-white leading-tight">
                    श्रम साथी डिजिटल श्रमिक कार्ड
                  </h4>
                  <span className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase">
                    Shrama Sathi Worker ID
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[9px] font-mono font-bold">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="grid grid-cols-12 gap-4 items-center relative z-10 mb-4">
              <div className="col-span-8 space-y-2">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">नाम / Full Name:</span>
                  <span className="text-base font-bold text-white tracking-wide">{name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">पेशा / Trade:</span>
                    <span className="text-amber-200 font-semibold">{trade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">मानक वेतन / Wage:</span>
                    <span className="text-emerald-400 font-bold">₹{dailyWage}/दिन (8hr)</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">राज्य / State:</span>
                  <span className="text-slate-300 text-xs">{state}</span>
                </div>
              </div>

              {/* QR Code and Chip */}
              <div className="col-span-4 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 shadow-inner">
                <QrCode className="w-16 h-16 text-amber-300 mb-1" />
                <span className="text-[9px] font-mono text-slate-300 text-center leading-tight">
                  हेल्पलाइन 14434
                </span>
              </div>
            </div>

            {/* UAN & Security footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] relative z-10">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase font-mono">e-Shram UAN:</span>
                <span className="font-mono text-amber-400 font-bold tracking-wider">{uan}</span>
              </div>
              <div className="flex items-center text-emerald-400 font-semibold text-[10px] space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2x ओवरटाइम संरक्षित</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

