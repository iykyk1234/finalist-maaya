import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { SiteNav } from "@/components/site-nav";
import { SiteContact } from "@/components/site-contact";

const searchSchema = z.object({
  name: z.string().min(1).max(80),
  age: z.number().int().min(10).max(100),
  budget: z.number().int().min(100).max(500000),
  requirement: z.enum(["hair", "salon", "bridal"]),
});

export const Route = createFileRoute("/book/results")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Your matches — Maaya" },
      { name: "description", content: "Studios matched to your preferences." },
    ],
  }),
  component: Results,
});

type Studio = {
  name: string;
  area: string;
  blurb: string;
  cost: number;
  tags: ("hair" | "salon" | "bridal")[];
  url: string;
};

const studios: Studio[] = [
  { name: "Bblunt Bandra", area: "Bandra West", blurb: "Editorial cuts & colour by Adhuna Bhabani's team.", cost: 2500, tags: ["hair", "salon"], url: "https://www.google.com/maps/search/Bblunt+Bandra" },
  { name: "Jean-Claude Biguine, Juhu", area: "Juhu", blurb: "Parisian-style salon — keratin, balayage, blow-dries.", cost: 3500, tags: ["hair", "salon"], url: "https://www.google.com/maps/search/Jean+Claude+Biguine+Juhu" },
  { name: "Toni & Guy, Lower Parel", area: "Lower Parel", blurb: "London-school precision cutting & colour.", cost: 3000, tags: ["hair", "salon"], url: "https://www.google.com/maps/search/Toni+Guy+Lower+Parel" },
  { name: "Enrich, Powai", area: "Powai", blurb: "Full-service neighbourhood salon.", cost: 1500, tags: ["salon", "hair"], url: "https://www.google.com/maps/search/Enrich+Salon+Powai" },
  { name: "Rossano Ferretti, Worli", area: "Worli", blurb: "Method haircut atelier — couture experience.", cost: 8000, tags: ["hair", "salon"], url: "https://www.google.com/maps/search/Rossano+Ferretti+Worli" },
  { name: "Looks Salon, Andheri", area: "Andheri West", blurb: "Reliable everyday salon with bridal packages.", cost: 1200, tags: ["salon", "hair", "bridal"], url: "https://www.google.com/maps/search/Looks+Salon+Andheri" },
  { name: "Namrata Soni Studio", area: "Bandra", blurb: "Celebrity bridal makeup artist.", cost: 75000, tags: ["bridal"], url: "https://www.google.com/maps/search/Namrata+Soni+Studio+Mumbai" },
  { name: "Mickey Contractor MAC", area: "Khar", blurb: "Iconic bridal & editorial makeup.", cost: 120000, tags: ["bridal"], url: "https://www.google.com/maps/search/Mickey+Contractor+Mumbai" },
  { name: "Cory Walia at Le Mystère", area: "Bandra", blurb: "Soft glam bridal looks.", cost: 60000, tags: ["bridal"], url: "https://www.google.com/maps/search/Cory+Walia+Mumbai" },
  { name: "Savleen Manchanda", area: "Juhu", blurb: "Modern bride, dewy finish.", cost: 45000, tags: ["bridal"], url: "https://www.google.com/maps/search/Savleen+Manchanda+Mumbai" },
  { name: "Geetanjali Salon, Malad", area: "Malad", blurb: "Budget-friendly hair & salon services.", cost: 800, tags: ["salon", "hair"], url: "https://www.google.com/maps/search/Geetanjali+Salon+Malad" },
  { name: "Lakmé Salon, Colaba", area: "Colaba", blurb: "Trusted chain — full salon menu.", cost: 1800, tags: ["salon", "hair", "bridal"], url: "https://www.google.com/maps/search/Lakme+Salon+Colaba" },
];

function Results() {
  const { name, age, budget, requirement } = Route.useSearch();

  const matches = studios
    .filter((s) => s.tags.includes(requirement))
    .map((s) => ({ ...s, fits: s.cost <= budget }))
    .sort((a, b) => Number(b.fits) - Number(a.fits) || a.cost - b.cost);

  const reqLabel = requirement === "bridal" ? "Bridal Makeup" : requirement[0].toUpperCase() + requirement.slice(1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="bg-beige pt-36 pb-16">
        <div className="container-x max-w-3xl">
          <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-4 animate-rise-in">Your matches</p>
          <h1
            className="font-display text-4xl md:text-5xl text-midnight leading-tight animate-rise-in"
            style={{ animationDelay: "120ms" }}
          >
            Welcome, {name} — here is what we have lovingly curated{" "}
            <em className="italic text-darkgreen">for you.</em>
          </h1>
          <p className="mt-4 text-muted-foreground animate-rise-in" style={{ animationDelay: "240ms" }}>
            Age {age} · Budget ₹{budget.toLocaleString("en-IN")} · {reqLabel}
          </p>

          <Link
            to="/book"
            className="mt-4 inline-block text-xs uppercase tracking-widest text-darkgreen hover:text-rosy"
          >
            ← Edit preferences
          </Link>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="container-x max-w-3xl">
          <ul className="divide-y divide-border/60 rounded-2xl bg-beige/40 border border-border/60 overflow-hidden">
            {matches.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 px-6 py-5 transition-all duration-300 hover:bg-cream hover:pl-8"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-xl md:text-2xl text-midnight truncate">
                        {s.name}
                      </h3>
                      {s.fits ? (
                        <span className="rounded-full bg-moss/40 text-darkgreen px-2 py-0.5 text-[10px] uppercase tracking-widest">
                          In budget
                        </span>
                      ) : (
                        <span className="rounded-full bg-rosy/20 text-rosy px-2 py-0.5 text-[10px] uppercase tracking-widest">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {s.area} · {s.blurb}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-darkgreen text-lg">
                      ₹{s.cost.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Book →
                    </div>
                  </div>
                </a>
              </li>
            ))}
            {matches.length === 0 && (
              <li className="px-6 py-10 text-center text-muted-foreground">
                No studios matched. Try a different requirement.
              </li>
            )}
          </ul>
        </div>
      </section>
      <SiteContact />
    </div>
  );
}
