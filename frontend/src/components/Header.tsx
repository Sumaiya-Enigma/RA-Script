'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dna, Sun, Moon, Languages, User as UserIcon, LogOut, ChevronDown, ShieldCheck, UserCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout, openAuthModal, openProfileModal } = useAuth();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Controls & Profile Dropdown */}
        <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
          
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

          {/* User Profile Avatar Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-700 transition-all cursor-pointer shadow-3xs"
              >
                <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px] uppercase border border-indigo-400/30 overflow-hidden shrink-0">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name || user.username} className="h-full w-full object-cover" />
                  ) : (
                    (user.full_name || user.username).substring(0, 2)
                  )}
                </div>
                <div className="text-left hidden sm:block max-w-[130px] truncate">
                  <p className="text-[11px] font-bold text-slate-200 leading-none truncate">{user.full_name || user.username}</p>
                  <p className="text-[9px] text-indigo-300 font-mono leading-tight mt-0.5 truncate">{user.role?.split(' ')[0] || 'RA'}</p>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 text-slate-800 dark:text-slate-100 z-50 animate-fade-in">
                  {/* User info header card */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs uppercase border border-indigo-400/30 overflow-hidden shrink-0">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name || user.username} className="h-full w-full object-cover" />
                      ) : (
                        (user.full_name || user.username).substring(0, 2)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{user.full_name || user.username}</p>
                      <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate font-mono">{user.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded text-[9px] font-bold">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      onClick={() => { setDropdownOpen(false); openProfileModal(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <UserIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> View &amp; Edit Profile
                    </button>
                    <button
                      onClick={() => { setDropdownOpen(false); openAuthModal(); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <UserCheck className="h-4 w-4 text-slate-500" /> Switch Account / Re-authenticate
                    </button>
                  </div>

                  <div className="border-t border-gray-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Logout Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <UserIcon className="h-3.5 w-3.5" /> Sign In / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
