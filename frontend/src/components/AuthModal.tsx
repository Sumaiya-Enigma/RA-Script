'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, signup, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        if (!usernameOrEmail.trim() || !password) {
          throw new Error('Please fill in all required fields');
        }
        await login(usernameOrEmail.trim(), password);
      } else {
        if (!username.trim() || !email.trim() || !password) {
          throw new Error('Please fill in all required fields');
        }
        await signup(username.trim(), email.trim(), password, fullName.trim());
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulatedGoogleAuth = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle(
        'google_oauth_token_' + Date.now(),
        'dilafrojlija@gmail.com',
        'Dilafroj Lija',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              {mode === 'login' ? 'Sign In to RA Script' : 'Create GxP Account'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              mode === 'login'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              mode === 'signup'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Google OAuth button */}
          <button
            onClick={handleSimulatedGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-bold shadow-3xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] text-gray-400 uppercase font-bold">Or with credentials</span>
            <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'login' ? (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Username or Email</label>
                <div className="relative mt-1">
                  <UserIcon className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="Enter username or email address"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Username</label>
                  <div className="relative mt-1">
                    <UserIcon className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose unique username"
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Email Address</label>
                  <div className="relative mt-1">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Full Legal Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full legal name for GxP signatures"
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Password</label>
              <div className="relative mt-1">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-indigo-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> {mode === 'login' ? 'Sign In' : 'Complete Registration'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 text-center text-[10px] text-gray-400 dark:text-slate-500 font-mono">
          US FDA 21 CFR Part 11 &amp; EU Annex 11 Compliant Auth Pipeline
        </div>
      </div>
    </div>
  );
}
