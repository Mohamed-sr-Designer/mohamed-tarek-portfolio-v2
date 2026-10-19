"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { dict, type Lang } from "@/lib/dict";
import { useContent } from "@/lib/content";

type Ctx = {
  lang: Lang;
  t: (typeof dict)["en"];
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<Ctx>({
  lang: "en",
  t: dict.en,
  setLang: () => {},
  toggle: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const { settings } = useContent();

  // hydrate from storage after mount (SSR renders English). English is the
  // default; Arabic is the option in the header. A visitor's own choice wins,
  // then the dashboard's default.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "ar" || saved === "en") setLangState(saved);
      else if (settings.defaultLang === "ar") setLangState("ar");
    } catch {}
  }, [settings.defaultLang]);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // The choice is saved only when the visitor makes it. Saving from the effect
  // above wrote the initial "en" back before the saved value was read, so any
  // remount (a draft preview, the edition switch) reset Arabic to English.
  const save = (l: Lang) => {
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };
  const setLang = useCallback((l: Lang) => {
    save(l);
    setLangState(l);
  }, []);
  const toggle = useCallback(
    () =>
      setLangState((v) => {
        const next = v === "en" ? "ar" : "en";
        save(next);
        return next;
      }),
    []
  );

  return (
    <LangContext.Provider value={{ lang, t: dict[lang], setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
