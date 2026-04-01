import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  getCopy,
  getInitialLanguage,
  getLocale,
  languageStorageKey,
  type Copy,
  type Language,
} from "./copy";

type LanguageContextValue = {
  language: Language;
  locale: string;
  copy: Copy;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function createLanguageContextValue(language: Language, setLanguage: (language: Language) => void): LanguageContextValue {
  return {
    language,
    locale: getLocale(language),
    copy: getCopy(language),
    setLanguage,
    toggleLanguage: () => setLanguage(language === "en" ? "pt" : "en"),
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage());

  useEffect(() => {
    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      // Ignore storage failures in constrained environments.
    }

    document.documentElement.lang = getLocale(language);
  }, [language]);

  const value = useMemo(
    () =>
      createLanguageContextValue(language, (nextLanguage) => {
        setLanguageState(nextLanguage);
      }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context) {
    return context;
  }

  const language = getInitialLanguage();

  return createLanguageContextValue(language, () => undefined);
}
