import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Clock,
  IndianRupee,
  MapPin,
  ArrowUpRight,
  Star,
  Plus,
  Navigation,
  LayoutGrid,
  Map as MapIcon,
  SlidersHorizontal,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteContact } from "@/components/site-contact";
import { SalonMap } from "@/components/salon-map";
import { MUMBAI_LOCALITIES, distanceKm, type Locality } from "@/lib/mumbai-localities";
import exploreHair from "@/assets/explore-hair.jpg";
import exploreNails from "@/assets/explore-nails.jpg";
import exploreSkin from "@/assets/explore-skin.jpg";
import exploreMakeup from "@/assets/explore-makeup.jpg";
import aboutProducts from "@/assets/about-products.jpg";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Studios — Maaya Mumbai Salon Marketplace" },
      {
        name: "description",
        content:
          "Discover Mumbai salons near you. Filter by rating, price, service and distance — map view, card view, and locality-based search.",
      },
      { property: "og:title", content: "Explore Mumbai Salons — Maaya" },
      {
        property: "og:description",
        content: "Locality-based salon discovery with interactive map and filters.",
      },
    ],
  }),
  component: ExplorePage,
});

type Store = {
  id: string;
  name: string;
  area: string;
  address: string;
  category: string;
  image: string;
  timings: string;
  avgCost: number;
  rating: number;
  blurb: string;
  lat: number;
  lon: number;
};

const stores: Store[] = [
  { id: "bblunt-bandra", name: "BBlunt Studio", area: "Bandra West", address: "Linking Road, Bandra West, Mumbai 400050", category: "Hair", image: exploreHair, timings: "10:00 AM – 9:00 PM", avgCost: 2800, rating: 4.7, blurb: "Signature blow-dries and editorial colour in the heart of Bandra.", lat: 19.0606, lon: 72.8362 },
  { id: "jean-claude-juhu", name: "Jean-Claude Biguine", area: "Juhu", address: "Juhu Tara Road, Juhu, Mumbai 400049", category: "Hair & Spa", image: exploreSkin, timings: "9:30 AM – 8:30 PM", avgCost: 3500, rating: 4.6, blurb: "A French parlour ritual minutes from Juhu beach.", lat: 19.1075, lon: 72.8263 },
  { id: "nailspa-colaba", name: "The Nail Spa", area: "Colaba", address: "Causeway, Colaba, Mumbai 400005", category: "Nails", image: exploreNails, timings: "11:00 AM – 9:00 PM", avgCost: 1600, rating: 4.5, blurb: "Gel, chrome and slow nail art in a sunlit Causeway loft.", lat: 18.9176, lon: 72.8312 },
  { id: "kromakay-khar", name: "Kromakay", area: "Khar West", address: "14th Road, Khar West, Mumbai 400052", category: "Hair", image: exploreHair, timings: "10:00 AM – 8:30 PM", avgCost: 4200, rating: 4.8, blurb: "Mumbai's quietly legendary cut-and-colour house.", lat: 19.0696, lon: 72.8331 },
  { id: "lakme-powai", name: "Lakmé Salon", area: "Powai", address: "Hiranandani Gardens, Powai, Mumbai 400076", category: "Skin & Spa", image: exploreSkin, timings: "10:00 AM – 9:00 PM", avgCost: 2200, rating: 4.3, blurb: "Reliable facials, threading and pre-wedding packages.", lat: 19.1197, lon: 72.9051 },
  { id: "anaika-andheri", name: "Anaika Beauty Lounge", area: "Andheri West", address: "Lokhandwala Complex, Andheri West, Mumbai 400053", category: "Bridal & Makeup", image: exploreMakeup, timings: "10:30 AM – 8:00 PM", avgCost: 5800, rating: 4.6, blurb: "Trousseau-ready makeup artists with a soft, modern hand.", lat: 19.1364, lon: 72.8296 },
  { id: "richfeel-dadar", name: "Richfeel Trichology", area: "Dadar West", address: "Gokhale Road, Dadar West, Mumbai 400028", category: "Hair & Scalp", image: aboutProducts, timings: "10:00 AM – 7:30 PM", avgCost: 2400, rating: 4.2, blurb: "Scalp treatments and considered hair-care for Mumbai's humidity.", lat: 19.018, lon: 72.8417 },
  { id: "envi-vile-parle", name: "Envi Salon & Spa", area: "Vile Parle West", address: "Hanuman Road, Vile Parle West, Mumbai 400056", category: "Hair & Spa", image: exploreSkin, timings: "10:00 AM – 9:00 PM", avgCost: 3100, rating: 4.5, blurb: "A full-service neighbourhood spa with thoughtful styling rooms.", lat: 19.1003, lon: 72.8443 },
  { id: "nailartistry-malad", name: "Nail Artistry Studio", area: "Malad West", address: "Mindspace, Malad West, Mumbai 400064", category: "Nails", image: exploreNails, timings: "11:00 AM – 8:30 PM", avgCost: 1400, rating: 4.4, blurb: "Mumbai's go-to for extensions, jellies and 3D nail art.", lat: 19.1849, lon: 72.8392 },
  { id: "geetanjali-bkc", name: "Geetanjali Salon", area: "Bandra Kurla Complex", address: "G Block, BKC, Mumbai 400051", category: "Bridal & Makeup", image: exploreMakeup, timings: "10:00 AM – 8:00 PM", avgCost: 6500, rating: 4.7, blurb: "Editorial bridal beauty with a calm, glass-walled studio.", lat: 19.0686, lon: 72.8688 },
  { id: "blo-worli", name: "BLO Blow Dry Bar", area: "Worli", address: "Worli Sea Face, Worli, Mumbai 400018", category: "Hair", image: exploreHair, timings: "9:00 AM – 9:00 PM", avgCost: 1900, rating: 4.6, blurb: "Twenty-minute blow-dries with a sea view — no cuts, no fuss.", lat: 19.0176, lon: 72.8118 },
];

const FAV_KEY = "maaya:favorites";
const LOC_KEY = "maaya:locality";
const CATEGORIES = ["All", "Hair", "Nails", "Skin & Spa", "Bridal & Makeup", "Hair & Spa", "Hair & Scalp"];

type ViewMode = "cards" | "map";

function ExplorePage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [locality, setLocality] = useState<Locality | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number; label: string } | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "loading" | "denied">("idle");
  const [view, setView] = useState<ViewMode>("cards");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Filters
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(7000);
  const [category, setCategory] = useState("All");
  const [maxDistance, setMaxDistance] = useState(30); // km

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavorites(JSON.parse(raw));
      const loc = localStorage.getItem(LOC_KEY);
      if (loc) {
        const found = MUMBAI_LOCALITIES.find((l) => l.id === loc);
        if (found) setLocality(found);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const toggleFav = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const pickLocality = (l: Locality) => {
    setLocality(l);
    setUserCoords(null);
    try {
      localStorage.setItem(LOC_KEY, l.id);
    } catch {
      /* ignore */
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoState("denied");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: "Your location" });
        setLocality(null);
        setGeoState("idle");
      },
      () => setGeoState("denied"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const center = userCoords
    ? { lat: userCoords.lat, lon: userCoords.lon }
    : locality
      ? { lat: locality.lat, lon: locality.lon }
      : { lat: 19.076, lon: 72.8777 }; // Mumbai

  const centerLabel = userCoords?.label ?? locality?.name ?? "Mumbai";

  const enriched = useMemo(
    () =>
      stores
        .map((s) => ({ ...s, distance: distanceKm({ lat: s.lat, lon: s.lon }, center) }))
        .sort((a, b) => a.distance - b.distance),
    [center.lat, center.lon],
  );

  const filtered = useMemo(
    () =>
      enriched.filter(
        (s) =>
          s.rating >= minRating &&
          s.avgCost <= maxPrice &&
          s.distance <= maxDistance &&
          (category === "All" || s.category === category),
      ),
    [enriched, minRating, maxPrice, maxDistance, category],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Header */}
      <section className="bg-midnight text-cream pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-x">
          <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-6 animate-rise-in">
            The marketplace
          </p>
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] max-w-4xl animate-rise-in"
            style={{ animationDelay: "120ms" }}
          >
            Mumbai's finest salons,{" "}
            <em className="italic text-rosy">discovered street by street.</em>
          </h1>
          <p
            className="mt-6 max-w-xl text-cream/70 leading-relaxed animate-rise-in"
            style={{ animationDelay: "240ms" }}
          >
            Choose your locality or share your location, then filter by what you love.
          </p>
        </div>
      </section>

      {/* CHOOSE YOUR LOCALITY */}
      <section className="bg-cream border-b border-border/60">
        <div className="container-x py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-2">Step one</p>
              <h2 className="font-display text-2xl md:text-3xl text-midnight">
                Choose your locality
              </h2>
            </div>
            <button
              onClick={detectLocation}
              disabled={geoState === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-darkgreen text-cream px-5 py-3 text-xs uppercase tracking-widest hover:bg-midnight transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Navigation className="h-3.5 w-3.5" />
              {geoState === "loading" ? "Locating…" : "Use my location"}
            </button>
          </div>

          {geoState === "denied" && (
            <p className="text-xs text-destructive mb-4">
              We couldn't access your location. Pick a locality below instead.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {MUMBAI_LOCALITIES.map((l) => {
              const active = !userCoords && locality?.id === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => pickLocality(l)}
                  className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 ${
                    active
                      ? "bg-midnight text-cream"
                      : "bg-beige text-midnight hover:bg-rosy hover:text-cream"
                  }`}
                >
                  {l.name}
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Showing salons near <span className="text-midnight font-medium">{centerLabel}</span> ·{" "}
            {filtered.length} of {stores.length} match your filters
          </p>
        </div>
      </section>

      {/* Filters + View toggle */}
      <section className="bg-beige sticky top-0 z-20 border-b border-border/60 backdrop-blur-md bg-beige/85">
        <div className="container-x py-4 flex flex-wrap items-center gap-3 md:gap-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-darkgreen">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-full bg-cream border border-border/70 px-4 py-2 text-xs text-midnight focus:outline-none focus:border-darkgreen"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Service: {c}
              </option>
            ))}
          </select>

          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="rounded-full bg-cream border border-border/70 px-4 py-2 text-xs text-midnight focus:outline-none focus:border-darkgreen"
          >
            <option value={0}>Rating: Any</option>
            <option value={4}>4.0+</option>
            <option value={4.5}>4.5+</option>
            <option value={4.7}>4.7+</option>
          </select>

          <label className="inline-flex items-center gap-2 text-xs text-midnight bg-cream border border-border/70 rounded-full px-4 py-2">
            Up to ₹{maxPrice.toLocaleString("en-IN")}
            <input
              type="range"
              min={1000}
              max={7000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-darkgreen w-28"
            />
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-midnight bg-cream border border-border/70 rounded-full px-4 py-2">
            Within {maxDistance} km
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="accent-darkgreen w-28"
            />
          </label>

          <div className="ml-auto inline-flex rounded-full border border-border/70 bg-cream p-1">
            <button
              onClick={() => setView("cards")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                view === "cards" ? "bg-midnight text-cream" : "text-midnight hover:text-darkgreen"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Cards
            </button>
            <button
              onClick={() => setView("map")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                view === "map" ? "bg-midnight text-cream" : "text-midnight hover:text-darkgreen"
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" /> Map
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-beige">
        <div className="container-x py-12 md:py-16">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-cream p-12 text-center">
              <p className="text-midnight font-display text-2xl mb-2">No salons match yet</p>
              <p className="text-sm text-muted-foreground">
                Try a wider distance, lower minimum rating or a different service.
              </p>
            </div>
          ) : view === "map" ? (
            <div className="grid lg:grid-cols-[1fr_360px] gap-6">
              <div className="overflow-hidden rounded-2xl border border-border bg-beige h-[70vh] min-h-[480px]">
                <SalonMap
                  center={center}
                  salons={filtered}
                  activeId={activeId}
                  onSelect={setActiveId}
                />
              </div>
              <div className="space-y-3 lg:max-h-[70vh] lg:overflow-y-auto pr-1">
                {filtered.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveId(s.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 ${
                      activeId === s.id
                        ? "bg-midnight text-cream border-midnight"
                        : "bg-cream border-border/60 hover:border-darkgreen hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-lg leading-tight">{s.name}</p>
                        <p className={`text-[11px] uppercase tracking-widest mt-0.5 ${activeId === s.id ? "text-cream/70" : "text-muted-foreground"}`}>
                          {s.area}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[11px] uppercase tracking-widest ${activeId === s.id ? "text-rosy" : "text-darkgreen"}`}>
                        {s.distance.toFixed(1)} km
                      </span>
                    </div>
                    <div className={`mt-2 flex items-center gap-3 text-xs ${activeId === s.id ? "text-cream/80" : "text-muted-foreground"}`}>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-rosy text-rosy" /> {s.rating.toFixed(1)}
                      </span>
                      <span>₹{s.avgCost.toLocaleString("en-IN")} avg</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => (
                <StoreCard
                  key={s.id}
                  store={s}
                  distance={s.distance}
                  favorite={favorites.includes(s.id)}
                  onToggleFav={() => toggleFav(s.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteContact />

      <Link
        to="/add-store"
        className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-3 rounded-full bg-darkgreen text-cream pl-5 pr-6 py-4 shadow-lg shadow-midnight/20 transition-all duration-300 hover:bg-midnight hover:-translate-y-1 hover:scale-105 text-xs uppercase tracking-widest"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-cream/15">
          <Plus className="h-4 w-4" />
        </span>
        Add your own store
      </Link>
    </div>
  );
}

function StoreCard({
  store,
  distance,
  favorite,
  onToggleFav,
}: {
  store: Store;
  distance: number;
  favorite: boolean;
  onToggleFav: () => void;
}) {
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.address}`)}`;
  return (
    <article className="group flex flex-col rounded-2xl bg-cream border border-border/60 overflow-hidden transition-all duration-500 hover:border-moss hover:-translate-y-2 hover:shadow-[0_24px_44px_-24px_rgba(0,0,0,0.35)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-beige">
        <img
          src={store.image}
          alt={`${store.name} in ${store.area}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-midnight/55 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-[11px] uppercase tracking-widest text-darkgreen">
          {store.category}
        </span>
        <span className="absolute right-16 top-4 rounded-full bg-midnight/85 text-cream px-3 py-1 text-[11px] uppercase tracking-widest">
          {distance.toFixed(1)} km
        </span>
        <button
          type="button"
          onClick={onToggleFav}
          aria-pressed={favorite}
          aria-label={favorite ? `Remove ${store.name} from favorites` : `Save ${store.name} to favorites`}
          className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full backdrop-blur transition-colors ${
            favorite ? "bg-rosy text-cream" : "bg-cream/90 text-midnight hover:bg-rosy hover:text-cream"
          }`}
        >
          <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
        </button>
        <div className="absolute left-4 bottom-4 flex items-center gap-1.5 text-cream text-xs">
          <Star className="h-3.5 w-3.5 fill-rosy text-rosy" />
          <span className="font-medium">{store.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 flex-1">
        <div>
          <h3 className="font-display text-2xl text-midnight leading-tight">{store.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3 w-3" /> {store.area}
          </p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{store.blurb}</p>

        <dl className="grid grid-cols-2 gap-3 mt-auto pt-2 text-sm">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-darkgreen mt-0.5" />
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Timings</dt>
              <dd className="text-midnight text-[13px]">{store.timings}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <IndianRupee className="h-4 w-4 text-darkgreen mt-0.5" />
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg. cost</dt>
              <dd className="text-midnight text-[13px]">₹{store.avgCost.toLocaleString("en-IN")} / visit</dd>
            </div>
          </div>
        </dl>

        <a
          href={gmaps}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-between rounded-full bg-midnight text-cream px-5 py-3 text-xs uppercase tracking-widest transition-all duration-300 hover:bg-darkgreen hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_12px_24px_-12px_rgba(0,0,0,0.45)]"
        >
          Explore more
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
