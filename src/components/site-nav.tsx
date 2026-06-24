import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteNav() {
  const { t } = useT();
  const [open, setOpen] = useState(false);

  const navLinks: { label: string; href: string }[] = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.explore"), href: "/explore" },
    { label: t("nav.products"), href: "/products" },
    { label: t("nav.community"), href: "/community" },
    { label: t("nav.contact"), href: "/#contact" },
  ];

  return (
    <header className="fixed left-1/2 top-4 z-30 w-[92%] max-w-5xl -translate-x-1/2 md:top-6 md:w-auto">
      <div className="flex items-center justify-between gap-4 rounded-full bg-midnight/80 px-5 py-3 backdrop-blur-md border border-cream/10 md:px-7 md:py-3.5">
        <nav className="hidden md:flex items-center gap-6 text-[12px] uppercase tracking-[0.18em] text-cream/90">
          {navLinks.map((l) =>
            l.href.startsWith("/") && !l.href.includes("#") ? (
              <Link key={l.label} to={l.href} className="transition-colors hover:text-rosy">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="transition-colors hover:text-rosy">
                {l.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher tone="dark" />
          <Link
            to="/book"
            className="inline-flex items-center gap-1 rounded-full bg-cream/95 px-4 py-2 text-xs font-medium uppercase tracking-widest text-darkgreen hover:bg-rosy hover:text-cream transition-colors shrink-0"
          >
            {t("nav.book")} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2 ml-auto">
          <LanguageSwitcher tone="dark" />
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-full bg-cream/10 text-cream"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-midnight/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 grid h-10 w-10 place-items-center rounded-full bg-cream/10 text-cream"
          >
            <X className="h-5 w-5" />
          </button>
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-lg uppercase tracking-[0.2em] text-cream/90 hover:text-rosy transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/book"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-cream/95 px-6 py-3 text-sm font-medium uppercase tracking-widest text-darkgreen hover:bg-rosy hover:text-cream transition-colors"
          >
            {t("nav.book")} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </header>
  );
}
