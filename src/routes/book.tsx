import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ref, push, serverTimestamp } from "firebase/database";
import { SiteNav } from "@/components/site-nav";
import { SiteContact } from "@/components/site-contact";
import { getBookingsFirebase, isBookingsFirebaseConfigured } from "@/lib/firebase-bookings";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book — Maaya" },
      {
        name: "description",
        content:
          "Tell us what you're looking for and we'll match you with the right Mumbai studios.",
      },
    ],
  }),
  component: BookPage,
});

type Requirement = "hair" | "salon" | "bridal";

function BookPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [budget, setBudget] = useState("");
  const [requirement, setRequirement] = useState<Requirement | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !age || !budget || !requirement) return;

    const payload = {
      name: name.trim(),
      age: Number(age),
      budget: Number(budget),
      requirement,
    };

    setSubmitting(true);
    setSaveError(null);

    if (isBookingsFirebaseConfigured) {
      try {
        const fb = getBookingsFirebase();
        if (fb) {
          await push(ref(fb.db, "bookings"), {
            ...payload,
            createdAt: serverTimestamp(),
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
          });
        }
      } catch (err) {
        console.error("Failed to save booking to Firebase", err);
        setSaveError("Couldn't save your details, but we'll still show your matches.");
      }
    }

    setSubmitting(false);
    navigate({ to: "/book/results", search: payload });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="bg-beige pt-36 pb-20">
        <div className="container-x max-w-2xl">
          <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-4 animate-rise-in">Book</p>
          <h1
            className="font-display text-4xl md:text-6xl text-midnight leading-tight animate-rise-in"
            style={{ animationDelay: "120ms" }}
          >
            Tell us a little about <em className="italic text-darkgreen">who you are.</em>
          </h1>
          <p
            className="mt-6 text-muted-foreground leading-relaxed animate-rise-in"
            style={{ animationDelay: "240ms" }}
          >
            A handful of considered details, and we'll thoughtfully surface the Mumbai
            studios most attuned to your style, budget and occasion.
          </p>


          <form onSubmit={onSubmit} className="mt-12 space-y-6 rounded-2xl bg-cream p-8 border border-border/60">
            <Field label="Name">
              <input
                type="text"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="input-base"
              />
            </Field>

            <Field label="Age">
              <input
                type="number"
                required
                min={10}
                max={100}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 28"
                className="input-base"
              />
            </Field>

            <Field label="Budget (₹)">
              <input
                type="number"
                required
                min={100}
                max={500000}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 3000"
                className="input-base"
              />
            </Field>

            <Field label="Requirement">
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { v: "hair", l: "Hair" },
                    { v: "salon", l: "Salon" },
                    { v: "bridal", l: "Bridal Makeup" },
                  ] as { v: Requirement; l: string }[]
                ).map((opt) => (
                  <button
                    type="button"
                    key={opt.v}
                    onClick={() => setRequirement(opt.v)}
                    className={`rounded-full px-4 py-2.5 text-sm uppercase tracking-widest border transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_10px_22px_-12px_rgba(0,0,0,0.35)] ${
                      requirement === opt.v
                        ? "bg-darkgreen text-cream border-darkgreen"
                        : "bg-cream text-midnight border-border hover:border-darkgreen"
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-darkgreen px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-cream transition-all duration-300 hover:bg-rosy hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100"
            >
              {submitting ? "Saving your details…" : "Reveal my matching studios"}
            </button>

            {saveError && (
              <p className="text-xs text-rosy text-center mt-2">{saveError}</p>
            )}
          </form>
        </div>
      </section>
      <SiteContact />

      <style>{`
        .input-base {
          width: 100%;
          border-radius: 9999px;
          border: 1px solid hsl(var(--border));
          background: white;
          padding: 0.75rem 1.25rem;
          font-size: 0.95rem;
          color: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-base:focus { border-color: hsl(var(--ring)); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
        {label}
      </span>
      {children}
    </label>
  );
}
