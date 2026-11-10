'use client';

import React, { useState, useEffect } from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, Send, CheckCircle2, Clock, Search, ChevronRight } from 'lucide-react';

interface Grievance {
  id: string;
  workerName: string;
  workerPhone: string;
  category: string;
  title: string;
  description: string;
  employerName?: string;
  workplaceLocation?: string;
  urgency: string;
  status: string;
  resolutionNotes?: string;
  createdAt: string;
}

const CATEGORY_MAP: Record<string, string> = {
  WAGE_THEFT: 'मजदूरी रोकना या कटौती (Wage Theft)',
  UNSAFE_CONDITIONS: 'असुरक्षित कार्यस्थल (Unsafe Site Conditions)',
  DENIAL_OF_LEAVE: 'अवकाश या छुट्टी से इनकार (Denial of Leave)',
  HARASSMENT: 'उत्पीड़न या दुर्व्यवहार (Harassment)',
  ACCIDENT_COMPENSATION: 'दुर्घटना मुआवजा न मिलना (Compensation Dispute)',
  OTHER: 'अन्य शिकायत (Other)',
};

export default function GrievanceTracker() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');

  // Form state
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [category, setCategory] = useState('WAGE_THEFT');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [workplaceLocation, setWorkplaceLocation] = useState('');
  const [urgency, setUrgency] = useState('HIGH');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchGrievances = async (phoneFilter?: string) => {
    setLoading(true);
    try {
      const url = new URL('/api/grievances', window.location.origin);
      if (phoneFilter) url.searchParams.set('phone', phoneFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setGrievances(data.grievances || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerName,
          workerPhone,
          category,
          title,
          description,
          employerName,
          workplaceLocation,
          urgency,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setTitle('');
        setDescription('');
        setEmployerName('');
        setWorkplaceLocation('');
        fetchGrievances();
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Submit grievance error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 via-rose-800 to-red-900 p-5 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <AlertOctagon className="w-5 h-5 text-red-200" />
          </div>
          <div>
            <h2 className="font-bold text-base">श्रमिक शिकायत एवं विवाद निवारण केंद्र</h2>
            <p className="text-xs text-red-100">
              मजदूरी चोरी, अनुचित निष्कासन, उत्पीड़न और कार्यस्थल सुरक्षा शिकायतें दर्ज करें
            </p>
          </div>
        </div>
        <span className="text-xs bg-red-950/60 text-red-200 border border-red-500/30 px-3 py-1 rounded-full font-mono">
          LEGAL REDRESSAL
        </span>
      </div>

      {/* Emergency Help Banner */}
      <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-red-900 font-semibold">
          <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>आपातकालीन राष्ट्रीय श्रमिक हेल्पलाइन नंबर:</span>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="tel:14434"
            className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-full shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>14434 (श्रमिक हेल्पलाइन)</span>
          </a>
          <span className="text-slate-600">
            पोर्टल: <a href="https://shramsuvidha.gov.in" target="_blank" rel="noreferrer" className="underline font-semibold text-slate-800">shramsuvidha.gov.in</a>
          </span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Complaint Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">
            नई शिकायत दर्ज करें (Register Grievance)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                आपका नाम (Worker Name) *
              </label>
              <input
                type="text"
                required
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="उदा. रमेश कुमार"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                मोबाइल नंबर (Phone) *
              </label>
              <input
                type="tel"
                required
                value={workerPhone}
                onChange={(e) => setWorkerPhone(e.target.value)}
                placeholder="उदा. 9876543210"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                शिकायत की श्रेणी (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none bg-white font-medium"
              >
                {Object.entries(CATEGORY_MAP).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                प्राथमिकता / गंभीरता (Urgency)
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none bg-white font-medium"
              >
                <option value="CRITICAL">अति आवश्यक (Critical Emergency)</option>
                <option value="HIGH">उच्च प्राथमिकता (High)</option>
                <option value="MEDIUM">सामान्य (Medium)</option>
                <option value="LOW">कम (Low)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                नियोक्ता / ठेकेदार का नाम (Employer/Contractor)
              </label>
              <input
                type="text"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                placeholder="उदा. स्टार इंफ्रा डेवलपर्स"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                कार्यस्थल / साइट का पता (Workplace Location)
              </label>
              <input
                type="text"
                value={workplaceLocation}
                onChange={(e) => setWorkplaceLocation(e.target.value)}
                placeholder="उदा. गोमती नगर, लखनऊ"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              शिकायत का शीर्षक (Brief Subject) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा. 45 दिनों की मजदूरी का भुगतान नहीं किया गया"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              विस्तृत विवरण (Complaint Details) *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="घटना का पूरा विवरण दें, जैसे कितने दिनों से पैसा रुका है, क्या धमकी दी गई, क्या कोई लिखित रसीद या साक्ष्य है..."
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'दर्ज किया जा रहा है...' : 'शिकायत दर्ज करें (Submit Grievance)'}</span>
          </button>

          {submitSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
              आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है! इसे श्रम आयुक्त पोर्टल के प्रारूप में सुरक्षित किया गया है।
            </div>
          )}
        </form>

        {/* Right: Grievance Status Tracker */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-slate-800 text-sm">
                शिकायत स्थिति ट्रैक करें (Track Grievances)
              </h3>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                LIVE STATUS
              </span>
            </div>

            {/* Phone search filter */}
            <div className="flex space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="मोबाइल नंबर से खोजें..."
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="button"
                onClick={() => fetchGrievances(searchPhone)}
                className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                फिल्टर
              </button>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {loading ? (
                <p className="text-xs text-slate-400 py-4 text-center">डेटा लोड हो रहा है...</p>
              ) : grievances.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed rounded-xl p-4">
                  कोई शिकायत दर्ज नहीं मिली।
                </div>
              ) : (
                grievances.map((g) => (
                  <div
                    key={g.id}
                    className="p-3.5 border rounded-2xl bg-white shadow-2xs hover:border-red-300 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {g.id.slice(0, 10)}...
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          g.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : g.status === 'INVESTIGATING'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {g.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">
                      {g.title}
                    </h4>

                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {g.description}
                    </p>

                    <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-100">
                      <span>श्रमिक: {g.workerName} ({g.workerPhone})</span>
                      <span>{new Date(g.createdAt).toLocaleDateString('hi-IN')}</span>
                    </div>

                    {g.resolutionNotes && (
                      <div className="mt-1 text-[11px] bg-emerald-50 text-emerald-900 p-2 rounded-lg border border-emerald-200">
                        <strong>प्रशासनिक टिप्पणी: </strong>
                        {g.resolutionNotes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
