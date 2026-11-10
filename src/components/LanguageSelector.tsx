'use client';

import React from 'react';
import { Globe } from 'lucide-react';

export interface LanguageOption {
  code: string;
  label: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'en', label: 'English', native: 'English' },
];

interface LanguageSelectorProps {
  currentLang: string;
  onSelectLanguage: (lang: string) => void;
}

export default function LanguageSelector({
  currentLang,
  onSelectLanguage,
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full shadow-sm text-sm">
      <Globe className="w-4 h-4 text-orange-600" />
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
        भाषा / Language:
      </span>
      <select
        value={currentLang}
        onChange={(e) => onSelectLanguage(e.target.value)}
        className="bg-transparent font-medium text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer text-sm"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="text-slate-900">
            {lang.native} ({lang.label})
          </option>
        ))}
      </select>
    </div>
  );
}

