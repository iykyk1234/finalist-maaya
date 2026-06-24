import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { LANGUAGES, useT, type Lang } from "@/lib/i18n";

export function LanguageSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (code: Lang) => {
    setLang(code);
    setOpen(false);
  };

  const current = LANGUAGES.find((l) => l.code === lang)!;
  const trigger =
    tone === "dark"
      ? "bg-cream/10 text-cream hover:bg-cream/20"
      : "bg-midnight/10 text-midnight hover:bg-midnight/15";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-widest transition-colors ${trigger}`}
        aria-label="Change language"
      >
        <Globe className="h-3.5 w-3.5" />
        {current.native}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[150px] rounded-2xl bg-cream border border-border shadow-[0_18px_36px_-12px_rgba(0,0,0,0.35)] overflow-hidden z-50">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code as Lang)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm text-midnight hover:bg-beige transition-colors ${
                l.code === lang ? "font-semibold" : ""
              }`}
            >
              <span>{l.native}</span>
              {l.code === lang && <Check className="h-3.5 w-3.5 text-darkgreen" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
