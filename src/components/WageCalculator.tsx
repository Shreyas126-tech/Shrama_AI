'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Clock, IndianRupee, ShieldCheck, Save, CheckCircle2, History, AlertCircle } from 'lucide-react';

export default function WageCalculator() {
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [standardRate, setStandardRate] = useState<number>(650);
  const [workHours, setWorkHours] = useState<number>(8);
  const [overtimeHours, setOvertimeHours] = useState<number>(2);
  const [applyEPF, setApplyEPF] = useState(false);
  const [applyESIC, setApplyESIC] = useState(false);
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // Derived calculation
  const hourlyBase = standardRate > 0 ? standardRate / 8 : 0;
  const overtimeRate = hourlyBase * 2; // 2x statutory rule
  const overtimeEarnings = overtimeHours * overtimeRate;
  const grossWage = standardRate + overtimeEarnings;
  const epfDeduction = applyEPF ? grossWage * 0.12 : 0;
  const esicDeduction = applyESIC ? grossWage * 0.0075 : 0;
  const netWage = grossWage - (epfDeduction + esicDeduction);

  const fetchEntries = async () => {
    setLoadingEntries(true);
    try {
      const res = await fetch('/api/wages');
      const data = await res.json();
      if (data.success) {
        setEntries(data.wageEntries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/wages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerName: workerName.trim() || 'रमेश कुमार',
          workerPhone: workerPhone.trim() || '9876543210',
          workHours,
          standardRate,
          overtimeHours,
          applyEPF,
          applyESIC,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        fetchEntries();
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Save wage error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Calculator className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h2 className="font-bold text-base">डिजिटल मजदूरी डायरी व ओवरटाइम कैलकुलेटर</h2>
            <p className="text-xs text-emerald-100">
              वेतन संहिता 2019 (धारा 14) के अनुसार पारदर्शी मजदूरी और दोगुना ओवरटाइम गणना
            </p>
          </div>
        </div>
        <span className="text-xs bg-emerald-900/60 text-emerald-200 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
          2x Overtime Rule
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                श्रमिक का नाम (Worker Name)
              </label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="उदा. रमेश कुमार"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                मोबाइल नंबर (Phone)
              </label>
              <input
                type="tel"
                value={workerPhone}
                onChange={(e) => setWorkerPhone(e.target.value)}
                placeholder="उदा. 9876543210"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                दैनिक मूल मजदूरी (Base Daily Wage ₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">₹</span>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={standardRate}
                  onChange={(e) => setStandardRate(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                प्रति घंटा दर (Base): ₹{hourlyBase.toFixed(2)}/hr (8 घंटे आधार)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                अतिरिक्त घंटे (Overtime Hours)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute inset-y-0 left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="16"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                ओवरटाइम दर (2x): ₹{overtimeRate.toFixed(2)}/hr
              </span>
            </div>
          </div>

          {/* Deductions check */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              सामाजिक सुरक्षा कटौतियां (Social Security Deductions)
            </span>
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyEPF}
                  onChange={(e) => setApplyEPF(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-slate-700">कर्मचारी भविष्य निधि (EPF 12%)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyESIC}
                  onChange={(e) => setApplyESIC(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-slate-700">कर्मचारी राज्य बीमा (ESIC 0.75%)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              कार्य विवरण / टिप्पणी (Work Notes)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="उदा. कंक्रीटिंग कार्य, साइट नंबर 4, अतिरिक्त शिफ्ट"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'सुरक्षित किया जा रहा है...' : 'डायरी में सुरक्षित करें (Save Record)'}</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
              मजदूरी प्रविष्टि डेटाबेस में सफलतापूर्वक दर्ज कर ली गई है!
            </div>
          )}
        </form>

        {/* Right Card: Instant Wage Slip Breakdown */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center">
                <IndianRupee className="w-4 h-4 text-emerald-600 mr-1" />
                वैधानिक वेतन पर्ची (Statutory Wage Slip)
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                PRISMA SYNCED
              </span>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>सामान्य 8 घंटे मजदूरी:</span>
                <span className="font-semibold text-slate-800">₹{standardRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ओवरटाइम ({overtimeHours} घंटे × ₹{overtimeRate.toFixed(2)}):</span>
                <span className="font-semibold text-emerald-700">+₹{overtimeEarnings.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-800">
                <span>सकल मजदूरी (Gross Wage):</span>
                <span>₹{grossWage.toFixed(2)}</span>
              </div>

              {applyEPF && (
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>EPF कटौती (12%):</span>
                  <span className="text-red-600">-₹{epfDeduction.toFixed(2)}</span>
                </div>
              )}
              {applyESIC && (
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>ESIC कटौती (0.75%):</span>
                  <span className="text-red-600">-₹{esicDeduction.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t-2 border-emerald-600 pt-3 mt-2 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    कुल देय मजदूरी (Net Payable):
                  </span>
                  <span className="text-[10px] text-emerald-700">नकद अथवा प्रत्यक्ष बैंक अंतरण</span>
                </div>
                <span className="text-2xl font-black text-emerald-800">
                  ₹{netWage.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-100 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              मजदूरी संहिता 2019 धारा 14 संरक्षण
            </div>
            <p>
              यदि नियोक्ता निर्धारित दर या दोगुने ओवरटाइम का भुगतान करने से मना करे, तो तुरंत शिकायत अनुभाग में शिकायत दर्ज करें।
            </p>
          </div>
        </div>
      </div>

      {/* Recent Entries from Prisma */}
      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-slate-600" />
            <h4 className="font-bold text-sm text-slate-800">हालिया दर्ज की गई मजदूरी (Prisma SQLite History)</h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {entries.length} प्रविष्टियां मौजूद
          </span>
        </div>

        {loadingEntries ? (
          <p className="text-xs text-slate-400 py-3">डेटा लोड हो रहा है...</p>
        ) : entries.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">अभी कोई प्रविष्टि नहीं है। ऊपर दिए फॉर्म से नई प्रविष्टि दर्ज करें।</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600 uppercase font-bold">
                  <th className="py-2 px-3">श्रमिक</th>
                  <th className="py-2 px-3">दिनांक</th>
                  <th className="py-2 px-3">मूल वेतन</th>
                  <th className="py-2 px-3">ओवरटाइम घंटे</th>
                  <th className="py-2 px-3">सकल कुल</th>
                  <th className="py-2 px-3">शुद्ध देय</th>
                  <th className="py-2 px-3">स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {entries.slice(0, 5).map((row) => (
                  <tr key={row.id} className="hover:bg-white transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {row.worker?.name || 'श्रमिक साथी'}
                    </td>
                    <td className="py-2 px-3 text-slate-500 font-mono">
                      {new Date(row.date).toLocaleDateString('hi-IN')}
                    </td>
                    <td className="py-2 px-3 text-slate-700">₹{row.standardRate}</td>
                    <td className="py-2 px-3 text-emerald-700 font-semibold">{row.overtimeHours} hrs</td>
                    <td className="py-2 px-3 text-slate-700">₹{row.grossWage}</td>
                    <td className="py-2 px-3 font-bold text-emerald-800">₹{row.netWage}</td>
                    <td className="py-2 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {row.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
