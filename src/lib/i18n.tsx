import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Lang = "en" | "hi" | "mr";


export const LANGUAGES: { code: Lang; label: string; native: string; google: string }[] = [
  { code: "en", label: "English", native: "English", google: "en" },
  { code: "hi", label: "Hindi", native: "हिन्दी", google: "hi" },
  { code: "mr", label: "Marathi", native: "मराठी", google: "mr" },
];

const STORAGE_KEY = "maaya:lang";

export const GOOGLE_TRANSLATE_LANGUAGES = ["en", "hi", "mr"] as const;

export type GoogleTranslateLang = (typeof GOOGLE_TRANSLATE_LANGUAGES)[number];

function isGoogleTranslateLang(value: string): value is GoogleTranslateLang {
  return GOOGLE_TRANSLATE_LANGUAGES.includes(value as GoogleTranslateLang);
}

export function toGoogleLang(lang: Lang): GoogleTranslateLang {
  if (isGoogleTranslateLang(lang)) return lang;
  return "en";
}

type Dict = Record<string, { en: string; hi: string; mr: string }>;

export const DICT: Dict = {
  // Nav
  "nav.home": { en: "Home", hi: "होम", mr: "मुख्यपृष्ठ" },
  "nav.explore": { en: "Explore", hi: "खोजें", mr: "एक्सप्लोर" },
  "nav.about": { en: "About", hi: "बारे में", mr: "आमच्याबद्दल" },
  "nav.products": { en: "Buy Products", hi: "उत्पाद खरीदें", mr: "उत्पादने खरीदी करा" },
  "nav.community": { en: "Join Community", hi: "समुदाय से जुड़ें", mr: "समुदायात सामील व्हा" },
  "nav.contact": { en: "Contact", hi: "संपर्क", mr: "संपर्क" },
  "nav.book": { en: "Book", hi: "बुक करें", mr: "बुक करा" },
  "nav.language": { en: "Language", hi: "भाषा", mr: "भाषा" },

  // Explore
  "explore.kicker": { en: "The marketplace", hi: "मार्केटप्लेस", mr: "मार्केटप्लेस" },
  "explore.title1": { en: "Mumbai's finest salons,", hi: "मुंबई के बेहतरीन सैलून,", mr: "मुंबईचे उत्कृष्ट सलून," },
  "explore.title2": { en: "discovered street by street.", hi: "गली-गली में खोजे गए।", mr: "रस्त्या-रस्त्यावर शोधलेले." },
  "explore.subtitle": { en: "Choose your locality or share your location, then filter by what you love.", hi: "अपना इलाका चुनें या स्थान साझा करें, फिर अपनी पसंद के अनुसार फ़िल्टर करें।", mr: "तुमचा परिसर निवडा किंवा स्थान शेअर करा, नंतर तुमच्या आवडीनुसार फिल्टर करा." },
  "explore.step1": { en: "Step one", hi: "पहला कदम", mr: "पहिले पाऊल" },
  "explore.chooseLocality": { en: "Choose your locality", hi: "अपना इलाका चुनें", mr: "तुमचा परिसर निवडा" },
  "explore.useLocation": { en: "Use my location", hi: "मेरा स्थान उपयोग करें", mr: "माझे स्थान वापरा" },
  "explore.locating": { en: "Locating…", hi: "खोज रहे हैं…", mr: "शोधत आहोत…" },
  "explore.locationDenied": { en: "We couldn't access your location. Pick a locality below instead.", hi: "हम आपका स्थान नहीं ले सके। नीचे से इलाका चुनें।", mr: "आम्हाला तुमचे स्थान मिळाले नाही. खाली परिसर निवडा." },
  "explore.showingNear": { en: "Showing salons near", hi: "पास के सैलून दिखा रहे हैं", mr: "जवळचे सलून दाखवत आहोत" },
  "explore.filters": { en: "Filters", hi: "फ़िल्टर", mr: "फिल्टर" },
  "explore.service": { en: "Service", hi: "सेवा", mr: "सेवा" },
  "explore.rating": { en: "Rating", hi: "रेटिंग", mr: "रेटिंग" },
  "explore.anyRating": { en: "Any", hi: "कोई भी", mr: "कोणतेही" },
  "explore.upTo": { en: "Up to", hi: "तक", mr: "पर्यंत" },
  "explore.within": { en: "Within", hi: "के भीतर", mr: "च्या आत" },
  "explore.cards": { en: "Cards", hi: "कार्ड", mr: "कार्ड" },
  "explore.map": { en: "Map", hi: "नक्शा", mr: "नकाशा" },
  "explore.noMatch": { en: "No salons match yet", hi: "अभी कोई सैलून मेल नहीं खाता", mr: "अद्याप कोणतेही सलून जुळत नाही" },
  "explore.tryWider": { en: "Try a wider distance, lower minimum rating or a different service.", hi: "अधिक दूरी, कम रेटिंग या अलग सेवा आज़माएं।", mr: "जास्त अंतर, कमी रेटिंग किंवा वेगळी सेवा वापरून पहा." },

  // Community
  "community.kicker": { en: "Community", hi: "समुदाय", mr: "समुदाय" },
  "community.title": { en: "Locality lounges for Mumbai beauty lovers", hi: "मुंबई की सुंदरता प्रेमियों के लिए स्थानीय लाउंज", mr: "मुंबईच्या सौंदर्य प्रेमींसाठी स्थानिक लाउंज" },
  "community.chooseRoom": { en: "Choose your locality room", hi: "अपना इलाका रूम चुनें", mr: "तुमचा परिसर रूम निवडा" },
  "community.username": { en: "Username", hi: "उपयोगकर्ता नाम", mr: "वापरकर्तानाव" },
  "community.enter": { en: "Enter lounge", hi: "लाउंज में प्रवेश करें", mr: "लाउंजमध्ये प्रवेश करा" },
  "community.signedInAs": { en: "Signed in as", hi: "लॉग इन किया गया", mr: "लॉग इन केले" },
  "community.in": { en: "in", hi: "में", mr: "मध्ये" },
  "community.logout": { en: "Logout", hi: "लॉगआउट", mr: "लॉगआउट" },
  "community.changeRoom": { en: "Change locality", hi: "इलाका बदलें", mr: "परिसर बदला" },
  "community.startPost": { en: "Start a discussion…", hi: "चर्चा शुरू करें…", mr: "चर्चा सुरू करा…" },
  "community.post": { en: "Post", hi: "पोस्ट करें", mr: "पोस्ट करा" },
  "community.recent": { en: "Recent discussions", hi: "हाल की चर्चाएं", mr: "अलीकडील चर्चा" },
  "community.trending": { en: "Trending now", hi: "अभी ट्रेंडिंग", mr: "सध्या ट्रेंडिंग" },
  "community.askTitle": { en: "Ask the community", hi: "समुदाय से पूछें", mr: "समुदायाला विचारा" },
  "community.askDesc": { en: "Need a salon recommendation or a product tip? Post your question and locals will weigh in.", hi: "सैलून सुझाव चाहिए? सवाल पोस्ट करें, लोग जवाब देंगे।", mr: "सलूनची शिफारस हवी? प्रश्न पोस्ट करा, स्थानिक उत्तर देतील." },
  "community.comments": { en: "comments", hi: "टिप्पणियाँ", mr: "टिप्पण्या" },
  "community.likes": { en: "likes", hi: "लाइक", mr: "लाईक्स" },
  "community.posts": { en: "posts", hi: "पोस्ट", mr: "पोस्ट्स" },
  "community.addComment": { en: "Add a comment…", hi: "टिप्पणी जोड़ें…", mr: "टिप्पणी जोडा…" },
  "community.reply": { en: "Reply", hi: "जवाब", mr: "उत्तर" },
  "community.empty": { en: "No posts yet. Be the first to start a conversation.", hi: "अभी तक कोई पोस्ट नहीं। पहली बातचीत शुरू करें।", mr: "अद्याप पोस्ट नाही. पहिली चर्चा सुरू करा." },
  "community.notConfigured": { en: "Firebase isn't configured yet — chat is read-only until your project is connected.", hi: "Firebase अभी कॉन्फ़िगर नहीं है — चैट केवल पढ़ने के लिए है।", mr: "Firebase अद्याप कॉन्फिगर केलेले नाही — चॅट फक्त वाचण्यासाठी आहे." },
};

type GoogleTranslateApi = {
  translate: {
    TranslateElement: {
      new (options: { pageLanguage: string; includedLanguages: string; layout?: number }, element: string): unknown;
      getInstance?: () => { restore: () => void } | null;
      InlineLayout?: {
        SIMPLE: number;
        HORIZONTAL: number;
        VERTICAL: number;
      };
      FloatPosition?: Record<string, number>;
    };
  };
};

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
}

let googleTranslateInitialized = false;

function getGoogleTranslate(): GoogleTranslateApi | undefined {
  if (typeof window === "undefined") return undefined;
  const g = window.google as unknown as GoogleTranslateApi | undefined;
  return g?.translate ? g : undefined;
}



export function initGoogleTranslate() {
  if (typeof window === "undefined") return;
  if (googleTranslateInitialized) return;
  googleTranslateInitialized = true;

  const existing = document.getElementById("google_translate_element");
  if (!existing) {
    const div = document.createElement("div");
    div.id = "google_translate_element";
    div.style.display = "none";
    document.body.appendChild(div);
  }

  window.googleTranslateElementInit = () => {
    const api = getGoogleTranslate()?.translate;
    if (api?.TranslateElement) {
      try {
        new api.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,mr",
            layout: api.TranslateElement.InlineLayout?.HORIZONTAL ?? 1,
          },
          "google_translate_element"
        );
      } catch {
        /* ignore widget errors */
      }
    }
  };

  // Load the Google Translate script only if not already loaded.
  if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
}

function setGoogleTranslateCookie(lang: GoogleTranslateLang) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const domain = window.location.hostname;
  const path = "/";
  const expiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  const cookieValue = `/en/${lang}`;
  document.cookie = `googtrans=${cookieValue}; domain=${domain}; path=${path}; expires=${expiration}`;
  document.cookie = `googtrans=${cookieValue}; path=${path}; expires=${expiration}`;
}

export function changeGoogleTranslateLanguage(lang: GoogleTranslateLang) {
  if (typeof window === "undefined") return;
  setGoogleTranslateCookie(lang);
  try {
    const widget = getGoogleTranslate()?.translate.TranslateElement.getInstance?.();
    if (widget?.restore) {
      widget.restore();
    }
  } catch {
    /* fallback to reload */
  }
  if (lang !== "en") {
    // Try to trigger the translation using the dropdown if the widget is ready.
    try {
      const select = document.querySelector(
        "#\:0\.targetLanguage > select, .goog-te-combo, .goog-te-menu-value span"
      ) as HTMLSelectElement | null;
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
      }
    } catch {
      /* ignore */
    }
  }
}

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT) => string;
};

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && ["en", "hi", "mr"].includes(saved)) setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    console.log("[i18n] initializing Google Translate");
    initGoogleTranslate();
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    const googleLang = toGoogleLang(l);
    changeGoogleTranslateLanguage(googleLang);
  }, []);

  useEffect(() => {
    const googleLang = toGoogleLang(lang);
    changeGoogleTranslateLanguage(googleLang);
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key) => DICT[key]?.[lang] ?? DICT[key]?.en ?? String(key),
    }),
    [lang, setLang]
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useT() {
  const ctx = useContext(I18nCtx);
  if (!ctx) {
    // Fallback so components don't crash outside provider
    return {
      lang: "en" as Lang,
      setLang: () => {},
      t: (key: keyof typeof DICT) => DICT[key]?.en ?? String(key),
    };
  }
  return ctx;
}
