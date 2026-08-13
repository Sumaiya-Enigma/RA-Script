'use client';

import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Mail, ShieldCheck, Key, Save, Loader2, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserProfileModal() {
  const { user, isProfileModalOpen, closeProfileModal, updateProfile, changePassword } = useAuth();
  const [tab, setTab] = useState<'profile' | 'security'>('profile');

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setRole(user.role || 'Senior Regulatory Affairs Manager');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user, isProfileModalOpen]);

  if (!isProfileModalOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      await updateProfile({
        full_name: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        role: role,
        avatar_url: avatarUrl.trim() || undefined,
      });
      setMessage({ type: 'success', text: 'Profile information updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Password change failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase text-sm border border-indigo-400/30 overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name || user.username} className="h-full w-full object-cover" />
              ) : (
                (user.full_name || user.username).substring(0, 2)
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">{user.full_name || user.username}</h3>
              <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
            </div>
          </div>
          <button
            onClick={closeProfileModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
          <button
            onClick={() => { setTab('profile'); setMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700'
            }`}
          >
            <UserIcon className="h-3.5 w-3.5" /> Edit Profile
          </button>
          <button
            onClick={() => { setTab('security'); setMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'security'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700'
            }`}
          >
            <Key className="h-3.5 w-3.5" /> Security &amp; Password
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto">
          {message && (
            <div className={`p-3 rounded-lg text-xs border ${
              message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
            }`}>
              {message.text}
            </div>
          )}

          {tab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Official GxP Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 font-medium"
                >
                  <option value="Senior Regulatory Affairs Manager">Senior Regulatory Affairs Manager</option>
                  <option value="Regulatory CMC Expert">Regulatory CMC Expert</option>
                  <option value="Quality Assurance (QA) Director">Quality Assurance (QA) Director</option>
                  <option value="Submission Publishing Lead">Submission Publishing Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800"
                />
              </div>

              {/* GxP Certification badge */}
              <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-slate-700 text-xs flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <p className="text-[11px] text-indigo-900 dark:text-indigo-200 leading-tight">
                  Role &amp; Legal Name certified for <strong>US FDA 21 CFR Part 11</strong> electronic signature sign-offs.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-indigo-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" /> Save Profile Changes
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-indigo-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating Password...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" /> Update Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
