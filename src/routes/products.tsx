import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  MapPin,
  Phone,
  MessageCircle,
  Upload,
  Loader2,
  ShoppingBag,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { SiteNav } from "@/components/site-nav";
import { SiteContact } from "@/components/site-contact";
import { MUMBAI_LOCALITIES, type Locality } from "@/lib/mumbai-localities";
import {
  getProductsFirestore,
  getProductsStorage,
} from "@/lib/firebase-products";
import aboutProducts from "@/assets/about-products.jpg";
import exploreSkin from "@/assets/explore-skin.jpg";
import exploreHair from "@/assets/explore-hair.jpg";
import exploreMakeup from "@/assets/explore-makeup.jpg";
import exploreNails from "@/assets/explore-nails.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Buy Beauty Products — Maaya Mumbai Marketplace" },
      {
        name: "description",
        content:
          "Shop authentic beauty products from Mumbai sellers — skincare, haircare, makeup and wellness, locality by locality.",
      },
      { property: "og:title", content: "Buy Beauty Products — Maaya" },
      {
        property: "og:description",
        content: "Locality-based marketplace for Mumbai beauty products.",
      },
    ],
  }),
  component: ProductsPage,
});

const CATEGORIES = [
  "All",
  "Skincare",
  "Haircare",
  "Makeup",
  "Fragrance",
  "Wellness",
  "Tools",
] as const;
type Category = (typeof CATEGORIES)[number];

type Product = {
  id: string;
  name: string;
  brand?: string;
  description: string;
  price: number;
  category: string;
  image: string;
  locality: string;
  sellerName: string;
  sellerPhone?: string;
  sellerWhatsapp?: string;
  rating?: number;
  createdAt?: number;
};

// Seed sample products so the page never looks empty
const SAMPLE: Product[] = [
  { id: "s1", name: "Kumkumadi Radiance Oil", brand: "Forest Essentials", description: "Ayurvedic facial oil with saffron and turmeric for a lit-from-within glow.", price: 1850, category: "Skincare", image: exploreSkin, locality: "bandra", sellerName: "Bandra Beauty Co.", sellerPhone: "+919812345601", sellerWhatsapp: "+919812345601", rating: 4.8 },
  { id: "s2", name: "Cold-Pressed Argan Hair Mask", brand: "Soul Tree", description: "Deep-conditioning mask for Mumbai humidity. Sulphate-free, 250ml.", price: 1200, category: "Haircare", image: exploreHair, locality: "juhu", sellerName: "Juhu Naturals", sellerWhatsapp: "+919812345602", rating: 4.6 },
  { id: "s3", name: "Matte Liquid Lipstick — Mumbai Mauve", brand: "Kay Beauty", description: "16-hour transfer-proof matte finish in a signature city shade.", price: 699, category: "Makeup", image: exploreMakeup, locality: "andheri", sellerName: "Lokhandwala Lip Lab", sellerPhone: "+919812345603", rating: 4.5 },
  { id: "s4", name: "Gel Polish Starter Kit", brand: "Faces Canada", description: "12-shade kit with LED lamp — salon-grade nails at home.", price: 2400, category: "Tools", image: exploreNails, locality: "powai", sellerName: "Powai Nail Studio", sellerWhatsapp: "+919812345604", rating: 4.4 },
  { id: "s5", name: "Vetiver & Rose Eau de Parfum", brand: "Naso Profumi", description: "Indie Mumbai-blended fragrance, 50ml. Earthy, romantic, monsoon-proof.", price: 3200, category: "Fragrance", image: aboutProducts, locality: "bandra", sellerName: "Carter Road Scent Bar", sellerPhone: "+919812345605", rating: 4.9 },
  { id: "s6", name: "Ashwagandha Beauty Sleep Tonic", brand: "Kapiva", description: "Ayurvedic nightly elixir for stress, sleep and skin clarity.", price: 540, category: "Wellness", image: exploreSkin, locality: "dadar", sellerName: "Dadar Apothecary", sellerWhatsapp: "+919812345606", rating: 4.3 },
  { id: "s7", name: "Rose Quartz Gua Sha", description: "Hand-cut natural stone for facial massage and lymphatic drainage.", price: 850, category: "Tools", image: exploreSkin, locality: "colaba", sellerName: "Causeway Crystals", sellerWhatsapp: "+919812345607", rating: 4.7 },
  { id: "s8", name: "Hibiscus Hair Growth Serum", brand: "Khadi Natural", description: "Cold-infused hibiscus and bhringraj for thicker, glossier hair.", price: 480, category: "Haircare", image: exploreHair, locality: "borivali", sellerName: "Borivali Botanicals", sellerPhone: "+919812345608", rating: 4.2 },
];

function ProductsPage() {
  const [locality, setLocality] = useState<Locality | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [remote, setRemote] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [contactFor, setContactFor] = useState<Product | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // Initial load + realtime subscription
  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const { collection, onSnapshot, orderBy, query } = await import(
          "firebase/firestore"
        );
        const fs = getProductsFirestore();
        const q = query(collection(fs, "products"), orderBy("createdAt", "desc"));
        unsub = onSnapshot(
          q,
          (snap) => {
            if (cancelled) return;
            const list: Product[] = [];
            snap.forEach((doc) => {
              list.push(docToProduct(doc.id, doc.data() as ProductDoc));
            });
            setRemote(list);
            setLoading(false);
          },
          (err) => {
            console.error("Failed to load products", err);
            setLoading(false);
          },
        );
      } catch (err) {
        console.error("Failed to subscribe to products", err);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  const products = useMemo<Product[]>(() => {
    if (remote && remote.length) return remote;
    return SAMPLE;
  }, [remote]);
  const usingSample = !remote || remote.length === 0;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (locality && p.locality !== locality.id) return false;
      if (category !== "All" && p.category !== category) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${p.name} ${p.brand ?? ""} ${p.description} ${p.sellerName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, locality, category, search]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="bg-midnight text-cream pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-x">
          <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-6 animate-rise-in">
            The marketplace
          </p>
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] max-w-4xl animate-rise-in"
            style={{ animationDelay: "120ms" }}
          >
            Beauty products{" "}
            <em className="italic text-rosy">from your neighbourhood.</em>
          </h1>
          <p
            className="mt-6 max-w-xl text-cream/70 leading-relaxed animate-rise-in"
            style={{ animationDelay: "240ms" }}
          >
            Hand-picked skincare, haircare, makeup and wellness — sold by trusted Mumbai sellers,
            locality by locality.
          </p>
        </div>
      </section>

      {/* LOCALITY + SEARCH */}
      <section className="bg-cream border-b border-border/60">
        <div className="container-x py-10 md:py-12 space-y-8">
          <div>
            <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-2">Step one</p>
            <h2 className="font-display text-2xl md:text-3xl text-midnight mb-5">
              Choose your locality
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLocality(null)}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 ${
                  !locality ? "bg-midnight text-cream" : "bg-beige text-midnight hover:bg-rosy hover:text-cream"
                }`}
              >
                All Mumbai
              </button>
              {MUMBAI_LOCALITIES.map((l) => {
                const active = locality?.id === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLocality(l)}
                    className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 ${
                      active ? "bg-midnight text-cream" : "bg-beige text-midnight hover:bg-rosy hover:text-cream"
                    }`}
                  >
                    {l.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <label className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, sellers…"
                className="w-full rounded-full bg-cream border border-border/70 pl-11 pr-4 py-3 text-sm text-midnight focus:outline-none focus:border-darkgreen"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3.5 py-2 text-[11px] uppercase tracking-widest transition-colors ${
                    category === c
                      ? "bg-darkgreen text-cream"
                      : "bg-beige text-midnight hover:bg-rosy hover:text-cream"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-midnight font-medium">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "product" : "products"}
            {locality && (
              <>
                {" "}in <span className="text-midnight font-medium">{locality.name}</span>
              </>
            )}
            {usingSample && !loading && (
              <span className="ml-2 text-xs text-rosy">
                · Sample catalogue · be the first to list
              </span>
            )}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-beige">
        <div className="container-x py-12 md:py-16">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-cream/70 border border-border/60 overflow-hidden">
                  <div className="aspect-[4/3] bg-beige animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-beige animate-pulse rounded" />
                    <div className="h-3 bg-beige animate-pulse rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-cream p-12 text-center">
              <ShoppingBag className="h-10 w-10 text-darkgreen mx-auto mb-3" />
              <p className="text-midnight font-display text-2xl mb-2">
                {locality
                  ? `No products yet in ${locality.name}`
                  : "No products match your search"}
              </p>
              <p className="text-sm text-muted-foreground">
                {locality
                  ? "Be the first to list — tap the + button to add a product."
                  : "Try a different category, locality or search term."}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => setSelected(p)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteContact />

      {/* Floating Add */}
      <button
        onClick={() => setAddOpen(true)}
        aria-label="Add product"
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-darkgreen text-cream px-5 py-4 text-xs uppercase tracking-widest shadow-lg hover:bg-midnight transition-all hover:-translate-y-0.5"
      >
        <Plus className="h-4 w-4" /> Add Product
      </button>

      {selected && (
        <ProductDetail
          product={selected}
          onClose={() => setSelected(null)}
          onContact={() => {
            setContactFor(selected);
            setSelected(null);
          }}
        />
      )}
      {contactFor && (
        <SellerContact product={contactFor} onClose={() => setContactFor(null)} />
      )}
      {addOpen && (
        <AddProductModal
          onClose={() => setAddOpen(false)}
          onAdded={() => {
            setAddOpen(false);
            toast.success("Product listed");
          }}
        />
      )}
    </div>
  );
}

// ---- Firestore doc mapping ----------------------------------------------
type ProductDoc = {
  name: string;
  brand?: string | null;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  locality: string;
  sellerName: string;
  sellerPhone?: string | null;
  sellerWhatsapp?: string | null;
  rating?: number | null;
  createdAt?: number | { toMillis: () => number } | null;
};

function docToProduct(id: string, d: ProductDoc): Product {
  let createdAt: number | undefined;
  if (typeof d.createdAt === "number") createdAt = d.createdAt;
  else if (d.createdAt && typeof d.createdAt === "object" && "toMillis" in d.createdAt)
    createdAt = d.createdAt.toMillis();
  return {
    id,
    name: d.name,
    brand: d.brand ?? undefined,
    description: d.description,
    price: Number(d.price),
    category: d.category,
    image: d.imageUrl,
    locality: d.locality,
    sellerName: d.sellerName,
    sellerPhone: d.sellerPhone ?? undefined,
    sellerWhatsapp: d.sellerWhatsapp ?? undefined,
    rating: d.rating != null ? Number(d.rating) : undefined,
    createdAt,
  };
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const locName =
    MUMBAI_LOCALITIES.find((l) => l.id === product.locality)?.name ?? product.locality;
  return (
    <button
      onClick={onOpen}
      className="group text-left rounded-2xl bg-cream border border-border/60 overflow-hidden hover:-translate-y-0.5 hover:border-darkgreen transition-all"
    >
      <div className="aspect-[4/3] overflow-hidden bg-beige">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {product.brand && (
              <p className="text-[10px] uppercase tracking-widest text-darkgreen mb-1 truncate">
                {product.brand}
              </p>
            )}
            <p className="font-display text-lg text-midnight leading-tight line-clamp-2">
              {product.name}
            </p>
          </div>
          <p className="shrink-0 font-display text-lg text-midnight">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {locName}
          </span>
          {product.rating ? (
            <span className="inline-flex items-center gap-1 text-darkgreen">
              <Star className="h-3 w-3 fill-rosy text-rosy" /> {product.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-midnight/70 backdrop-blur-sm p-0 md:p-6" onClick={onClose}>
      <div
        className="relative w-full md:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-cream"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-midnight/10 text-midnight hover:bg-midnight hover:text-cream transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function ProductDetail({
  product,
  onClose,
  onContact,
}: {
  product: Product;
  onClose: () => void;
  onContact: () => void;
}) {
  const locName =
    MUMBAI_LOCALITIES.find((l) => l.id === product.locality)?.name ?? product.locality;
  return (
    <ModalShell onClose={onClose}>
      <div className="aspect-[16/10] overflow-hidden bg-beige">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-6 md:p-8">
        {product.brand && (
          <p className="text-[10px] uppercase tracking-widest text-darkgreen mb-2">
            {product.brand}
          </p>
        )}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-display text-2xl md:text-3xl text-midnight leading-tight">
            {product.name}
          </h3>
          <p className="font-display text-2xl text-midnight shrink-0">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-widest mb-6">
          <span className="rounded-full bg-beige px-3 py-1 text-midnight">
            {product.category}
          </span>
          <span className="rounded-full bg-beige px-3 py-1 text-midnight inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {locName}
          </span>
        </div>
        <div className="rounded-2xl border border-border/60 bg-beige/60 p-4 mb-6">
          <p className="text-[10px] uppercase tracking-widest text-darkgreen mb-1">Seller</p>
          <p className="font-display text-lg text-midnight">{product.sellerName}</p>
        </div>
        <button
          onClick={onContact}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-darkgreen text-cream px-6 py-3 text-xs uppercase tracking-widest hover:bg-midnight transition-colors"
        >
          Contact Seller
        </button>
      </div>
    </ModalShell>
  );
}

function SellerContact({ product, onClose }: { product: Product; onClose: () => void }) {
  const wa = product.sellerWhatsapp?.replace(/[^\d+]/g, "");
  const phone = product.sellerPhone?.replace(/[^\d+]/g, "");
  const waMsg = encodeURIComponent(
    `Hi ${product.sellerName}, I'm interested in "${product.name}" listed on Maaya.`,
  );
  return (
    <ModalShell onClose={onClose}>
      <div className="p-6 md:p-8">
        <p className="text-[10px] uppercase tracking-widest text-rosy mb-2">Contact</p>
        <h3 className="font-display text-2xl text-midnight mb-1">{product.sellerName}</h3>
        <p className="text-sm text-muted-foreground mb-6">About: {product.name}</p>
        <div className="space-y-3">
          {wa && (
            <a
              href={`https://wa.me/${wa.replace(/^\+/, "")}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-cream px-5 py-4 hover:border-darkgreen transition-colors"
            >
              <span className="inline-flex items-center gap-3 text-midnight">
                <MessageCircle className="h-4 w-4 text-darkgreen" /> WhatsApp
              </span>
              <span className="text-xs text-muted-foreground">{wa}</span>
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-cream px-5 py-4 hover:border-darkgreen transition-colors"
            >
              <span className="inline-flex items-center gap-3 text-midnight">
                <Phone className="h-4 w-4 text-darkgreen" /> Call
              </span>
              <span className="text-xs text-muted-foreground">{phone}</span>
            </a>
          )}
          {!wa && !phone && (
            <p className="text-sm text-muted-foreground">
              No contact details provided for this seller.
            </p>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function AddProductModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (p: Product) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "Skincare",
    locality: MUMBAI_LOCALITIES[0].id,
    sellerName: "",
    sellerPhone: "",
    sellerWhatsapp: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.sellerName.trim()) {
      toast.error("Name, description and seller name are required");
      return;
    }
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    setSubmitting(true);
    try {
      let finalImage = imageUrl.trim();
      if (file) {
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `product-images/${Date.now()}-${safe}`;
        const { ref, uploadBytes, getDownloadURL } = await import(
          "firebase/storage"
        );
        const storage = getProductsStorage();
        const r = ref(storage, path);
        await uploadBytes(r, file, { cacheControl: "public,max-age=3600" });
        finalImage = await getDownloadURL(r);
      }
      if (!finalImage) finalImage = aboutProducts;

      const { addDoc, collection, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const fs = getProductsFirestore();
      const docData: ProductDoc = {
        name: form.name.trim(),
        brand: form.brand.trim() || null,
        description: form.description.trim(),
        price,
        category: form.category,
        imageUrl: finalImage,
        locality: form.locality,
        sellerName: form.sellerName.trim(),
        sellerPhone: form.sellerPhone.trim() || null,
        sellerWhatsapp: form.sellerWhatsapp.trim() || null,
      };
      const ref = await addDoc(collection(fs, "products"), {
        ...docData,
        createdAt: serverTimestamp(),
      });
      onAdded(docToProduct(ref.id, { ...docData, createdAt: Date.now() }));
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save product. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-rosy mb-1">List a product</p>
          <h3 className="font-display text-2xl text-midnight">Add to the marketplace</h3>
        </div>

        <label className="block">
          <span className="text-xs uppercase tracking-widest text-darkgreen">Product image</span>
          <div className="mt-2 flex items-center gap-3">
            <label className="inline-flex items-center gap-2 rounded-full bg-beige border border-border/70 px-4 py-2 text-xs text-midnight cursor-pointer hover:border-darkgreen">
              <Upload className="h-3.5 w-3.5" />
              {file ? file.name.slice(0, 24) : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <span className="text-xs text-muted-foreground">or</span>
            <input
              type="url"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 min-w-0 rounded-full bg-cream border border-border/70 px-4 py-2 text-xs text-midnight focus:outline-none focus:border-darkgreen"
            />
          </div>
        </label>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Product name *" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="Brand" value={form.brand} onChange={(v) => set("brand", v)} />
        </div>

        <label className="block">
          <span className="text-xs uppercase tracking-widest text-darkgreen">Description *</span>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-2xl bg-cream border border-border/70 px-4 py-3 text-sm text-midnight focus:outline-none focus:border-darkgreen"
          />
        </label>

        <div className="grid md:grid-cols-3 gap-4">
          <Field
            label="Price (₹) *"
            value={form.price}
            onChange={(v) => set("price", v.replace(/[^\d]/g, ""))}
            inputMode="numeric"
          />
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-darkgreen">Category</span>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="mt-2 w-full rounded-full bg-cream border border-border/70 px-4 py-2.5 text-sm text-midnight focus:outline-none focus:border-darkgreen"
            >
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-darkgreen">Locality</span>
            <select
              value={form.locality}
              onChange={(e) => set("locality", e.target.value)}
              className="mt-2 w-full rounded-full bg-cream border border-border/70 px-4 py-2.5 text-sm text-midnight focus:outline-none focus:border-darkgreen"
            >
              {MUMBAI_LOCALITIES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Seller name *" value={form.sellerName} onChange={(v) => set("sellerName", v)} />
          <Field label="Phone" value={form.sellerPhone} onChange={(v) => set("sellerPhone", v)} placeholder="+91…" />
          <Field label="WhatsApp" value={form.sellerWhatsapp} onChange={(v) => set("sellerWhatsapp", v)} placeholder="+91…" />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-darkgreen text-cream px-6 py-3 text-xs uppercase tracking-widest hover:bg-midnight transition-colors disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {submitting ? "Publishing…" : "Publish product"}
        </button>
      </form>
    </ModalShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "text" | "numeric";
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-darkgreen">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="mt-2 w-full rounded-full bg-cream border border-border/70 px-4 py-2.5 text-sm text-midnight focus:outline-none focus:border-darkgreen"
      />
    </label>
  );
}