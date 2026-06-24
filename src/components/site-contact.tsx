import { Instagram, Mail, MapPin, Twitter, Facebook } from "lucide-react";

export function SiteContact() {
  return (
    <section id="contact" className="bg-midnight text-cream">
      <div className="container-x py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-6">
            <p className="text-rosy uppercase tracking-[0.3em] text-xs mb-6">Contact</p>
            <h2 className="font-display text-4xl md:text-6xl leading-tight">
              Say hello — we read <em className="italic text-rosy">everything.</em>
            </h2>
            <p className="mt-6 text-cream/70 max-w-md leading-relaxed">
              Whether you're a salon owner who'd like to be listed, a customer with feedback, or
              just someone who loves a good blow-dry — drop us a line.
            </p>

            <div className="mt-10 space-y-4">
              <ContactRow icon={<Mail className="h-4 w-4" />} label="hello@maaya.in" />
              <ContactRow
                icon={<MapPin className="h-4 w-4" />}
                label="Bandra West, Mumbai 400050"
              />
            </div>

            <div className="mt-10 flex gap-3">
              <Social icon={<Instagram className="h-4 w-4" />} label="Instagram" />
              <Social icon={<Twitter className="h-4 w-4" />} label="Twitter" />
              <Social icon={<Facebook className="h-4 w-4" />} label="Facebook" />
            </div>
          </div>

          <div className="md:col-span-6 grid sm:grid-cols-2 gap-8">
            <FooterCol
              title="About the project"
              body="Maaya started in 2025 as a weekend experiment between three Mumbaikars tired of WhatsApp-only bookings. Today it's a small, self-funded marketplace with a quiet community of stylists and clients."
            />
            <FooterCol
              title="The owners"
              body="Built by Aanya Mehta (design), Rohan Iyer (engineering) and Tara Shah (community) — all based in Mumbai. We answer our own emails."
            />
            <FooterCol
              title="For salons"
              body="Listing on Maaya is invite-only and free for the first year. Tell us about your studio and we'll come visit."
            />
            <FooterCol
              title="Press & partners"
              body="For partnerships, press kits or speaking, write to us at partners@maaya.in. We love a good collaboration."
            />
          </div>
        </div>

        <div className="mt-20 border-t border-cream/15 pt-8 flex flex-col md:flex-row gap-4 justify-between text-xs uppercase tracking-widest text-cream/50">
          <span>© 2026 Maaya Marketplace · Mumbai</span>
          <span>Designed slowly, with rosewater and chai.</span>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-cream/85">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-cream/10">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function Social({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 hover:bg-rosy hover:border-rosy transition-colors"
    >
      {icon}
    </a>
  );
}

function FooterCol({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="font-display text-xl text-rosy mb-3">{title}</h4>
      <p className="text-sm text-cream/70 leading-relaxed">{body}</p>
    </div>
  );
}
