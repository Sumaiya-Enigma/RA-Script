'use client';

import React from 'react';
import { Dna, Mail, Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-sm border border-indigo-400/20 text-white shrink-0">
            <Dna className="h-5 w-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-base tracking-tight text-white uppercase">
                {t('appName')}
              </span>
              <span className="px-1.5 py-0.2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded text-[9px] font-bold uppercase">
                {t('enterpriseAI') || 'Enterprise AI'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* User Email Context & Controls */}
        <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
          {/* User badge */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <Mail className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-mono text-[11px] font-medium text-slate-200">dilafrojlija@gmail.com</span>
          </div>

          {/* Compliance Status */}
          <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-700/30">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {t('complianceActive')}
            </span>
          </div>

          {/* Language Switcher (EN / BN) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-indigo-300 transition-all cursor-pointer shadow-3xs"
            title="Toggle Language (English / Bangla)"
          >
            <Languages className="h-3.5 w-3.5 text-indigo-400" />
            <span>{language === 'en' ? 'BN' : 'EN'}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg border border-slate-700 text-slate-200 transition-all cursor-pointer shadow-3xs"
            title="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
