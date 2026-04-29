import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Sparkles,
  Baby,
  HandHeart,
  UserPlus,
  MessageSquareHeart,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/go")({
  head: () => ({
    meta: [
      { title: "Tap Hub · Nehemiah's Temple" },
      {
        name: "description",
        content: "Welcome to Nehemiah's Temple. Tap below to find today's service, events, giving, and more.",
      },
    ],
  }),
  component: GoPage,
});

const tiles = [
  { to: "/today", label: "Today", desc: "Schedule & announcements", icon: Sparkles, tone: "primary" },
  { to: "/events", label: "Events", desc: "Upcoming & sign-ups", icon: CalendarDays, tone: "warm" },
  { to: "/kids", label: "Kids & Youth", desc: "Info & activities", icon: Baby, tone: "warm" },
  { to: "/give", label: "Give", desc: "Ways to give", icon: HandHeart, tone: "primary" },
  { to: "/new", label: "I'm New", desc: "Visitor connect", icon: UserPlus, tone: "warm" },
  { to: "/feedback", label: "Feedback", desc: "Prayer & notes", icon: MessageSquareHeart, tone: "warm" },
] as const;

function GoPage() {
  return (
    <div className="min-h-screen bg-warm-gradient">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:pt-14">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
            Nehemiah's Temple
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            Welcome to Tap Hub
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">
            Tap a card below to find what you need during today's service.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {tiles.map((t) => {
            const Icon = t.icon;
            const accent =
              t.tone === "primary"
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground";
            return (
              <Link
                key={t.to}
                to={t.to}
                className="tap-card group flex min-h-[140px] flex-col justify-between p-4 sm:p-5"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold text-foreground">
                    {t.label}
                  </div>
                  <div className="text-sm text-muted-foreground">{t.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/60 p-5 text-center shadow-soft">
          <p className="text-sm text-muted-foreground">
            "How beautiful upon the mountains are the feet of him that bringeth good tidings…"
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary/80">
            Isaiah 52:7
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Staff sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
