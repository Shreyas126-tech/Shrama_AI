'use client';

import React, { useState, useEffect } from 'react';
import { Award, Search, ExternalLink, FileText, CheckCircle2, Shield, HeartHandshake } from 'lucide-react';

interface Scheme {
  id: string;
  code: string;
  title: string;
  titleHindi: string;
  category: string;
  targetAudience: string;
  eligibilitySummary: string;
  benefitsSummary: string;
  documentsNeeded: string;
  officialPortalUrl?: string;
}

const CATEGORIES = [
  { code: 'ALL', label: 'सभी योजनाएं (All)' },
  { code: 'SOCIAL_SECURITY', label: 'सामाजिक सुरक्षा (Social Security)' },
  { code: 'PENSION', label: 'पेंशन योजनाएं (Pension)' },
  { code: 'HOUSING', label: 'भवन व सन्निर्माण (BOCW Housing)' },
  { code: 'HEALTH', label: 'स्वास्थ्य बीमा (Health)' },
  { code: 'ACCIDENT', label: 'दुर्घटना कवर (Accident)' },
];

export default function SchemeFinder() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [category, setCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/schemes', window.location.origin);
      if (category !== 'ALL') url.searchParams.set('category', category);
      if (searchTerm.trim()) url.searchParams.set('q', searchTerm.trim());

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setSchemes(data.schemes || []);
      }
    } catch (e) {
      console.error('Fetch schemes error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSchemes();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Award className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <h2 className="font-bold text-base">सरकारी श्रमिक कल्याणकारी योजनाएं</h2>
            <p className="text-xs text-blue-100">
              ई-श्रम, पीएम श्रम योगी मानधन, बीओसीडब्ल्यू एवं स्वास्थ्य बीमा पात्रता जांचें
            </p>
          </div>
        </div>
        <span className="text-xs bg-blue-900/60 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full font-mono">
          DIRECT BENEFIT TRANSFER
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 border-b border-slate-200 bg-slate-50 space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="योजना का नाम, पात्रता या कीवर्ड खोजें (उदा. ई-श्रम, पेंशन, बीमा)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            खोजें (Search)
          </button>
        </form>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.code}
              onClick={() => setCategory(cat.code)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category === cat.code
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            योजनाएं लोड हो रही हैं...
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            कोई योजना नहीं मिली। कृपया भिन्न कीवर्ड से खोजें।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all bg-white flex flex-col justify-between hover:border-blue-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {scheme.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {scheme.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {scheme.titleHindi}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">{scheme.title}</p>

                  <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <span className="font-bold text-slate-900">पात्रता: </span>
                      <span>{scheme.eligibilitySummary}</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-800">लाभ: </span>
                      <span>{scheme.benefitsSummary}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedScheme(scheme)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    दस्तावेज व विवरण
                  </button>

                  {scheme.officialPortalUrl && (
                    <a
                      href={scheme.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg"
                    >
                      <span>ऑफिशियल पोर्टल</span>
                      <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start border-b pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedScheme.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedScheme.titleHindi}
                </h3>
                <p className="text-xs text-slate-500">{selectedScheme.title}</p>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
                  लक्षित श्रमिक वर्ग (Target Audience)
                </h4>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {selectedScheme.targetAudience}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
                  पात्रता मापदंड (Eligibility Criteria)
                </h4>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {selectedScheme.eligibilitySummary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-emerald-800 uppercase tracking-wider mb-1">
                  योजना के मुख्य लाभ (Key Benefits)
                </h4>
                <p className="text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  {selectedScheme.benefitsSummary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
                  आवश्यक दस्तावेज (Documents Required)
                </h4>
                <p className="text-slate-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  {selectedScheme.documentsNeeded}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                बंद करें
              </button>
              {selectedScheme.officialPortalUrl && (
                <a
                  href={selectedScheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center shadow-sm"
                >
                  <span>पोर्टल पर आवेदन करें</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
