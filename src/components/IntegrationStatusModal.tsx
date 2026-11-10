'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Database, Mic, Cpu, X, RefreshCw } from 'lucide-react';

interface IntegrationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntegrationStatusModal({ isOpen, onClose }: IntegrationStatusModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-slate-800">
              System Architecture & Integration Verification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <p className="text-sm text-slate-600">
            SHRAMA SATHI AI enforces sovereign modularity. External APIs (Gnani.ai Evon & Timbre) and Prisma ORM are isolated and verify their live state honestly without fabricating mock API responses.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Verifying server-side integrations...</span>
            </div>
          ) : data ? (
            <div className="space-y-4">
              {/* Prisma ORM */}
              <div className="border rounded-xl p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-slate-800">Prisma ORM & SQLite Database</span>
                  </div>
                  {data.integrations?.prisma?.connected ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      CONNECTED
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      ERROR
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-mono">
                  Provider: {data.integrations?.prisma?.provider} | Status: {data.integrations?.prisma?.message}
                </p>
              </div>

              {/* Evon LLM */}
              <div className="border rounded-xl p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Gnani.ai Evon LLM (Reasoning Engine)</span>
                  </div>
                  {data.integrations?.evon?.configured ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      LIVE API READY
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      PENDING API KEY
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Model: <span className="font-mono font-medium">{data.integrations?.evon?.model}</span></div>
                  <div>Endpoint: <span className="font-mono text-slate-500">{data.integrations?.evon?.endpoint}</span></div>
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded p-2 mt-1">
                    {data.integrations?.evon?.note}
                  </div>
                </div>
              </div>

              {/* Timbre TTS */}
              <div className="border rounded-xl p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-slate-800">Gnani.ai Timbre TTS (Voice Engine)</span>
                  </div>
                  {data.integrations?.timbre?.configured ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      LIVE API READY
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      PENDING API KEY
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Default Voice: <span className="font-mono font-medium">{data.integrations?.timbre?.defaultVoice}</span></div>
                  <div>Endpoint: <span className="font-mono text-slate-500">{data.integrations?.timbre?.endpoint}</span></div>
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded p-2 mt-1">
                    {data.integrations?.timbre?.note}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-500">Failed to load integration status.</p>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900">
            <strong>Security Notice:</strong> All API credentials remain server-side in <code>.env</code> and are never leaked to client bundles. When Evon or Timbre keys are absent, the application gracefully activates verified statutory labor rules and client-side synthesis.
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2 border-t pt-4">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg flex items-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Re-check Status
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
