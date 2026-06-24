import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, IndianRupee, CheckCircle2, Lock } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteContact } from "@/components/site-contact";

export const Route = createFileRoute("/add-store")({
  head: () => ({
    meta: [
      { title: "Add your store — Maaya Mumbai Salon Marketplace" },
      {
        name: "description",
        content:
          "List your Mumbai salon on Maaya. Share your details, pay a small listing fee and reach the city's most considered beauty crowd.",
      },
      { property: "og:title", content: "List your salon on Maaya" },
      {
        property: "og:description",
        content: "A small listing fee gets your studio in front of Mumbai's beauty community.",
      },
    ],
  }),
  component: AddStorePage,
});

const LISTING_FEE = 499;

function AddStorePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "payment" | "done">("details");
  const [form, setForm] = useState({
    name: "",
    area: "",
    address: "",
    category: "Hair",
    timings: "",
    avgCost: "",
    blurb: "",
    contact: "",
    email: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const fakePay = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock — in production this would call a payment provider
    setTimeout(() => setStep("done"), 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="bg-midnight text-cream pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-x">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cream/70 hover:text-rosy transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to marketplace
          </Link>
          <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-4 animate-rise-in">List your studio</p>
          <h1
            className="font-display text-4xl md:text-6xl leading-[1.05] max-w-3xl animate-rise-in"
            style={{ animationDelay: "120ms" }}
          >
            Bring the artistry of your salon to{" "}
            <em className="italic text-rosy">Maaya.</em>
          </h1>
          <p
            className="mt-5 max-w-xl text-cream/70 leading-relaxed animate-rise-in"
            style={{ animationDelay: "240ms" }}
          >
            Share a few thoughtful details about your studio and complete a modest listing
            contribution of <span className="text-cream">₹{LISTING_FEE}</span>. Once verified,
            your salon goes live across the marketplace within twenty-four hours.
          </p>

        </div>
      </section>

      <section className="bg-beige">
        <div className="container-x py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            {/* Steps indicator */}
            <ol className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground mb-10">
              <li className={step === "details" ? "text-midnight" : ""}>1 · Details</li>
              <li className="text-muted-foreground/40">—</li>
              <li className={step === "payment" ? "text-midnight" : ""}>2 · Payment</li>
              <li className="text-muted-foreground/40">—</li>
              <li className={step === "done" ? "text-midnight" : ""}>3 · Live</li>
            </ol>

            {step === "details" && (
              <form
                onSubmit={submitDetails}
                className="rounded-2xl bg-cream border border-border/60 p-8 md:p-10 space-y-5"
              >
                <Field label="Salon name" required>
                  <input required value={form.name} onChange={update("name")} className={inputCls} placeholder="e.g. Saanvi Studio" />
                </Field>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Area" required>
                    <input required value={form.area} onChange={update("area")} className={inputCls} placeholder="Bandra West" />
                  </Field>
                  <Field label="Category" required>
                    <select required value={form.category} onChange={update("category")} className={inputCls}>
                      <option>Hair</option>
                      <option>Hair & Spa</option>
                      <option>Nails</option>
                      <option>Skin & Spa</option>
                      <option>Bridal & Makeup</option>
                      <option>Hair & Scalp</option>
                    </select>
                  </Field>
                </div>

                <Field label="Full address" required>
                  <input required value={form.address} onChange={update("address")} className={inputCls} placeholder="Street, locality, Mumbai 400000" />
                </Field>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Timings" required>
                    <input required value={form.timings} onChange={update("timings")} className={inputCls} placeholder="10:00 AM – 9:00 PM" />
                  </Field>
                  <Field label="Average cost (₹)" required>
                    <input required type="number" min={100} value={form.avgCost} onChange={update("avgCost")} className={inputCls} placeholder="2000" />
                  </Field>
                </div>

                <Field label="Short description" required>
                  <textarea required rows={3} value={form.blurb} onChange={update("blurb")} className={`${inputCls} resize-none`} placeholder="A line or two about what makes your salon special." />
                </Field>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Contact number" required>
                    <input required value={form.contact} onChange={update("contact")} className={inputCls} placeholder="+91 98xxxxxxxx" />
                  </Field>
                  <Field label="Email" required>
                    <input required type="email" value={form.email} onChange={update("email")} className={inputCls} placeholder="hello@yoursalon.com" />
                  </Field>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-midnight text-cream px-6 py-4 text-xs uppercase tracking-widest hover:bg-darkgreen transition-colors mt-4"
                >
                  Continue to payment
                </button>
              </form>
            )}

            {step === "payment" && (
              <form
                onSubmit={fakePay}
                className="rounded-2xl bg-cream border border-border/60 p-8 md:p-10 space-y-6"
              >
                <div>
                  <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-3">Listing fee</p>
                  <div className="flex items-baseline gap-2 text-midnight">
                    <IndianRupee className="h-7 w-7" />
                    <span className="font-display text-5xl">{LISTING_FEE}</span>
                    <span className="text-sm text-muted-foreground">one-time</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Covers verification, on-page placement and a year on the Maaya marketplace.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <Field label="Card number">
                    <input required inputMode="numeric" placeholder="4242 4242 4242 4242" className={inputCls} />
                  </Field>
                  <div className="grid grid-cols-2 gap-5">
                    <Field label="Expiry">
                      <input required placeholder="MM / YY" className={inputCls} />
                    </Field>
                    <Field label="CVC">
                      <input required inputMode="numeric" placeholder="123" className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Name on card">
                    <input required className={inputCls} />
                  </Field>
                </div>

                <p className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                  <Lock className="h-3 w-3" /> Demo checkout — no real card is charged.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="flex-1 rounded-full border border-border px-6 py-4 text-xs uppercase tracking-widest text-midnight hover:bg-beige transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] rounded-full bg-darkgreen text-cream px-6 py-4 text-xs uppercase tracking-widest hover:bg-midnight transition-colors"
                  >
                    Pay ₹{LISTING_FEE} & list my salon
                  </button>
                </div>
              </form>
            )}

            {step === "done" && (
              <div className="rounded-2xl bg-cream border border-border/60 p-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-darkgreen mx-auto mb-5" />
                <h2 className="font-display text-3xl text-midnight">You're on the list.</h2>
                <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                  Thanks {form.name || "for joining"}. We'll verify your studio and have it live on
                  the marketplace within 24 hours. A receipt is on its way to {form.email || "your inbox"}.
                </p>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/explore" })}
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-midnight text-cream px-8 py-4 text-xs uppercase tracking-widest hover:bg-darkgreen transition-colors"
                >
                  Back to marketplace
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteContact />
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-beige/40 px-4 py-3 text-sm text-midnight placeholder:text-muted-foreground/60 focus:outline-none focus:border-darkgreen focus:bg-cream transition-colors";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label} {required && <span className="text-rosy">*</span>}
      </span>
      {children}
    </label>
  );
}
