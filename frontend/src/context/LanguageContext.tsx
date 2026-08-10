'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const translations: Translations = {
  appName: { en: 'RA Script', bn: 'আরএ স্ক্রিপ্ট' },
  tagline: { en: 'AI Regulatory Affairs Assistant • Pharmaceutical CMC Specialist', bn: 'এআই রেগুলেটরি অ্যাফেয়ার্স অ্যাসিস্ট্যান্ট • ফারমাসিউটিক্যাল সিএমসি স্পেশালিস্ট' },
  complianceActive: { en: 'Compliance Active', bn: 'কমপ্লায়েন্স সক্রিয়' },
  submissionsNavigator: { en: 'Submissions Navigator', bn: 'সাবমিশন নেভিগেটর' },
  tabIntake: { en: 'Product Intake', bn: 'পণ্য ইনটেক' },
  tabWorkspace: { en: 'Dossier Workspace', bn: 'ডসিয়ার ওয়ার্কস্পেস' },
  tabDocuments: { en: 'Ingestion & OCR', bn: 'ইনজেশ্চন ও ওসিআর' },
  tabWriter: { en: 'AI Regulatory Writer', bn: 'এআই রেগুলেটরি রাইটার' },
  tabConsistency: { en: 'Consistency Engine', bn: 'কনসিস্টেন্সি ইঞ্জিন' },
  tabCompliance: { en: 'Rule Engine & Gaps', bn: 'রুল ইঞ্জিন ও গ্যা্যাপস' },
  tabAudit: { en: 'GxP Audit Logs', bn: 'GxP অডিট লগ' },
  tabPublishing: { en: 'eCTD Publisher', bn: 'ই-সিটিডি পাবলিশার' },
  cmcModuleTitle: { en: 'CMC Intelligence Module', bn: 'সিএমসি ইন্টেলিজেন্স মডিউল' },
  cmcModuleDesc: { en: 'Connected to the US FDA Dissolution Database & ICH Q1-Q14 Guidelines library.', bn: 'ইউএস এফডিএ দ্রবীভূতকরণ ডেটাবেস এবং আইসিএইচ নির্দেশিকা লাইব্রেরির সাথে সংযুক্ত।' },
  draftsBadge: { en: 'Drafts', bn: 'খসড়া' },
  sequenceBadge: { en: 'Sequence', bn: 'সিকোয়েন্স' },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('rascript_lang') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rascript_lang', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'bn' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
