import { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext";
export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("portfolio-language") === "zh-Hant"
        ? "zh-Hant"
        : "en";
    } catch {
      return "en";
    }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem("portfolio-language", language);
    } catch {
      /* Storage is optional. */
    }
  }, [language]);
  const t = (en, zh) =>
    Array.isArray(en)
      ? en[language === "en" ? 0 : 1]
      : language === "en"
        ? en
        : zh;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
