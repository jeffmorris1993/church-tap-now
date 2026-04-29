import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { HandHeart, CreditCard, Building2, Mail } from "lucide-react";

export const Route = createFileRoute("/give")({
  head: () => ({
    meta: [
      { title: "Give · Tap Hub" },
      { name: "description", content: "Ways to give and support the ministry of Nehemiah's Temple." },
    ],
  }),
  component: GivePage,
});

const options = [
  {
    icon: CreditCard,
    title: "Give online",
    body: "Secure one-time or recurring giving by card or bank.",
    cta: "Open online giving",
    href: "#",
  },
  {
    icon: HandHeart,
    title: "Text to give",
    body: "Text GIVE to (555) 010-2025 to start.",
    cta: "Open messages",
    href: "sms:5550102025?&body=GIVE",
  },
  {
    icon: Building2,
    title: "In person",
    body: "Drop your gift in the offering box near the lobby.",
  },
  {
    icon: Mail,
    title: "By mail",
    body: "Nehemiah's Temple · 100 Faith Ave · Your City, ST 00000",
  },
];

function GivePage() {
  return (
    <PageShell
      title="Give"
      subtitle='"Each of you should give what you have decided in your heart to give." — 2 Cor. 9:7'
    >
      <div className="space-y-3">
        {options.map((o) => {
          const Icon = o.icon;
          const inner = (
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-display text-lg font-semibold">{o.title}</div>
                <p className="mt-1 text-sm text-foreground/80">{o.body}</p>
                {o.cta && (
                  <span className="mt-2 inline-block text-sm font-semibold text-primary">
                    {o.cta} →
                  </span>
                )}
              </div>
            </div>
          );
          return o.href ? (
            <a
              key={o.title}
              href={o.href}
              className="tap-card block p-5"
            >
              {inner}
            </a>
          ) : (
            <div key={o.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              {inner}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Nehemiah's Temple is a 501(c)(3) nonprofit. Gifts are tax-deductible.
      </p>
    </PageShell>
  );
}
