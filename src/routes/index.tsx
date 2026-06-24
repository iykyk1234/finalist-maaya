import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroSalon from "@/assets/hero-salon.jpg";
import aboutProducts from "@/assets/about-products.jpg";
import exploreHair from "@/assets/explore-hair.jpg";
import exploreNails from "@/assets/explore-nails.jpg";
import exploreSkin from "@/assets/explore-skin.jpg";
import exploreMakeup from "@/assets/explore-makeup.jpg";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteContact } from "@/components/site-contact";
import { useInView } from "@/hooks/use-in-view";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maaya — Mumbai's Curated Salon Marketplace" },
      {
        name: "description",
        content:
          "Maaya is Mumbai's quietly curated salon marketplace — a passionate home for the city's finest hair, skin, nail and bridal artistry.",
      },
      { property: "og:title", content: "Maaya — Mumbai's Curated Salon Marketplace" },
      {
        property: "og:description",
        content:
          "Discover Mumbai's most-loved studios and beauty artisans, gathered into one considered catalogue.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <Intro />
      <About />
      <Explore />
      <SiteContact />
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative isolate min-h-[100vh] overflow-hidden">
      <img
        src={heroSalon}
        alt="Mumbai contemporary salon interior in moss green and rosy brown tones"
        className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
        width={1600}
        height={1100}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/40 to-midnight/80" />
      <div className="container-x relative z-10 flex min-h-[100vh] flex-col justify-end pb-20 pt-40">
        <p className="text-cream/80 uppercase tracking-[0.3em] text-xs mb-6 animate-rise-in">
          Mumbai · Established 2025
        </p>
        <h1
          className="font-display text-cream text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl animate-rise-in"
          style={{ animationDelay: "120ms" }}
        >
          A more considered way to discover{" "}
          <em className="italic text-rosy">your salon</em> in the city.
        </h1>
        <p
          className="mt-8 max-w-xl text-cream/85 text-lg leading-relaxed animate-rise-in"
          style={{ animationDelay: "260ms" }}
        >
          Maaya is a passionately hand-picked marketplace of Mumbai's most-loved hair, skin,
          nail and bridal ateliers — one calm catalogue, honest reviews, effortless bookings.
        </p>
        <div
          className="mt-10 flex flex-wrap gap-3 animate-rise-in"
          style={{ animationDelay: "400ms" }}
        >
          <Link
            to="/explore"
            className="rounded-full bg-cream px-6 py-3 text-sm font-medium text-darkgreen transition-all duration-300 hover:bg-rosy hover:text-cream hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)]"
          >
            Explore the studios
          </Link>
          <a
            href="#about"
            className="rounded-full border border-cream/40 px-6 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-cream/15 hover:-translate-y-0.5 hover:scale-[1.04] hover:border-cream"
          >
            How Maaya works
          </a>
        </div>
      </div>
    </section>
  );
}

const introImages = [exploreHair, exploreMakeup, exploreSkin, exploreNails];

function Intro() {
  const [idx, setIdx] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % introImages.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-cream">
      <div
        ref={ref}
        className={`container-x grid md:grid-cols-12 gap-10 py-24 md:py-32 items-center reveal ${
          inView ? "reveal-in" : ""
        }`}
      >
        <div className="md:col-span-5 relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]">
          {introImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Mumbai salon craft"
              loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === idx ? "opacity-100 animate-ken-burns" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex gap-2">
            {introImages.map((_, i) => (
              <span
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                  i === idx ? "bg-cream" : "bg-cream/30"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="md:col-span-7">
          <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-6">The marketplace</p>
          <h2 className="font-display text-4xl md:text-6xl leading-tight text-midnight">
            Every neighbourhood. Every ritual.{" "}
            <em className="italic text-darkgreen">Gathered in one home.</em>
          </h2>
          <div className="mt-8 space-y-5 text-muted-foreground text-base md:text-[17px] leading-relaxed max-w-2xl">
            <p>
              From a quiet Bandra blow-dry bar to a fifth-generation barber in Bhuleshwar,
              Maaya stitches together Mumbai's salon scene into one elegant, easy-to-browse
              directory — built with the care this city deserves.
            </p>
            <p>
              Filter by service, budget or mood. Read reviews written by real Mumbaikars.
              Reserve in seconds — without calls, waitlists or guesswork.
            </p>
          </div>
          <div className="mt-8 flex gap-10 pt-6 border-t border-border">
            <Stat n="320+" l="Studios" />
            <Stat n="48" l="Neighbourhoods" />
            <Stat n="12k" l="Bookings / mo" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="transition-transform duration-300 hover:-translate-y-1">
      <div className="font-display text-3xl text-darkgreen">{n}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
    </div>
  );
}

function About() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section id="about" className="bg-beige">
      <div className="container-x py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-8 items-start mb-16">
          <h2 className="md:col-span-7 font-display text-4xl md:text-6xl text-midnight leading-tight">
            Designed around the way Mumbai truly{" "}
            <em className="italic text-rosy">gets ready.</em>
          </h2>
          <p className="md:col-span-5 text-muted-foreground leading-relaxed md:pt-4">
            Three small convictions hold the entire marketplace together — and they are the
            reason stylists and patrons keep returning to Maaya.
          </p>
        </div>

        <div
          ref={ref}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              tag: "01",
              title: "Curated, never crowded",
              body: "Every studio on Maaya is personally visited, vetted and reviewed by our city team. No paid placements, no shortcuts.",
              chips: ["Hand-picked", "Verified", "Independent"],
            },
            {
              tag: "02",
              title: "Honest, transparent pricing",
              body: "Menus, taxes and travel charges are listed up-front. You see precisely the same price the studio sees.",
              chips: ["Transparent", "No surprises", "Flat fees"],
            },
            {
              tag: "03",
              title: "A softer, slower experience",
              body: "A calm interface, slow photography and reviews that read like notes from a trusted friend — not ratings out of five.",
              chips: ["Editorial", "Considered", "Human"],
            },
          ].map((c, i) => (
            <div
              key={c.tag}
              className={`reveal ${inView ? "reveal-in" : ""}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <AboutCard {...c} />
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-12 gap-8 items-center">
          <img
            src={aboutProducts}
            alt="Curated salon products in moss green and rosy brown tones"
            loading="lazy"
            width={1200}
            height={900}
            className="md:col-span-7 w-full rounded-lg object-cover aspect-[4/3] transition-transform duration-700 hover:scale-[1.02]"
          />
          <div className="md:col-span-5">
            <p className="font-display italic text-2xl md:text-3xl text-darkgreen leading-snug">
              "We wanted a marketplace that felt less like a directory and more like a dear
              friend's little black book — written with patience, taste and love."
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
              — Maaya, founders' note
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutCard({
  tag,
  title,
  body,
  chips,
}: {
  tag: string;
  title: string;
  body: string;
  chips: string[];
}) {
  return (
    <div className="group rounded-2xl bg-cream p-8 flex flex-col gap-6 border border-border/60 transition-all duration-500 hover:border-moss hover:-translate-y-2 hover:shadow-[0_24px_40px_-24px_rgba(0,0,0,0.35)] h-full">
      <div className="flex items-center justify-between">
        <span className="font-display text-rosy text-xl transition-transform duration-500 group-hover:scale-110">
          {tag}
        </span>
        <span className="h-px flex-1 mx-4 bg-border" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Pillar</span>
      </div>
      <h3 className="font-display text-2xl md:text-3xl text-midnight leading-snug">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{body}</p>
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {chips.map((c) => (
          <span
            key={c}
            className="rounded-full bg-moss/30 text-darkgreen px-3 py-1 text-xs tracking-wide transition-colors duration-300 hover:bg-darkgreen hover:text-cream"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

const categories = [
  { title: "Hair", desc: "Cuts, colour, keratin and editorial blow-dries.", img: exploreHair, count: 124 },
  { title: "Nails", desc: "Gel, extensions and considered nail artistry.", img: exploreNails, count: 86 },
  { title: "Skin & Spa", desc: "Facials, peels, jade and lymphatic rituals.", img: exploreSkin, count: 72 },
  { title: "Bridal & Makeup", desc: "Trousseau-ready artisans across Mumbai.", img: exploreMakeup, count: 41 },
];

function Explore() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section id="explore" className="bg-cream">
      <div className="container-x py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-4">Explore</p>
            <h2 className="font-display text-4xl md:text-6xl text-midnight leading-tight max-w-2xl">
              Discover your kind of <em className="italic text-darkgreen">ritual.</em>
            </h2>
          </div>
          <Link
            to="/explore"
            className="group self-start md:self-end inline-flex items-center gap-2 text-sm uppercase tracking-widest text-darkgreen transition-colors hover:text-rosy"
          >
            View the full catalogue{" "}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, i) => (
            <Link
              key={c.title}
              to="/explore"
              className={`group relative overflow-hidden rounded-2xl bg-beige aspect-[3/4] block reveal ${
                inView ? "reveal-in" : ""
              } transition-transform duration-500 hover:-translate-y-2`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <img
                src={c.img}
                alt={c.title}
                loading="lazy"
                width={1000}
                height={1200}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/20 to-transparent transition-opacity duration-500 group-hover:from-midnight/95" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-cream">
                <span className="self-end rounded-full bg-cream/15 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-widest transition-colors group-hover:bg-rosy group-hover:text-cream">
                  {c.count} studios
                </span>
                <div className="transition-transform duration-500 group-hover:-translate-y-1">
                  <h3 className="font-display text-3xl">{c.title}</h3>
                  <p className="text-cream/80 text-sm mt-1">{c.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
