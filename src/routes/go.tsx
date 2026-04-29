import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Sparkles,
  Baby,
  HandHeart,
  UserPlus,
  MessageSquareHeart,
  ShieldCheck,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import heroImage from "@/assets/sanctuary-hero.jpg";
import logo from "@/assets/nt-logo.png";
import { serviceTimes, churchInfo } from "@/lib/content";

export const Route = createFileRoute("/go")({
  head: () => ({
    meta: [
      { title: "Tap Hub · Nehemiah's Temple" },
      {
        name: "description",
        content:
          "Welcome to Nehemiah's Temple. Tap to find today's schedule, events, giving, and ways to connect.",
      },
      { property: "og:title", content: "Tap Hub · Nehemiah's Temple" },
      {
        property: "og:description",
        content: "Come As You Are and Change As You Come.",
      },
      { property: "og:image", content: heroImage },
    ],
  }),
  component: GoPage,
});

interface MenuItem {
  to: "/new" | "/today" | "/events" | "/kids" | "/give" | "/feedback";
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "primary" | "accent";
}

const menuItems: MenuItem[] = [
  { to: "/new", title: "I'm New Here", description: "Connect with us", icon: UserPlus, tone: "primary" },
  { to: "/today", title: "Today at Nehemiah", description: "Announcements & schedule", icon: Sparkles, tone: "accent" },
  { to: "/events", title: "Events & Signups", description: "What's coming up", icon: CalendarDays, tone: "accent" },
  { to: "/kids", title: "Kids + Youth Hub", description: "For families", icon: Baby, tone: "accent" },
  { to: "/give", title: "Give", description: "Support the ministry", icon: HandHeart, tone: "primary" },
  { to: "/feedback", title: "Feedback / Prayer", description: "We're here for you", icon: MessageSquareHeart, tone: "accent" },
];

const navLinks = [
  { to: "/go", label: "Home" },
  { to: "/today", label: "Today" },
  { to: "/events", label: "Events" },
  { to: "/kids", label: "Kids" },
  { to: "/give", label: "Give" },
] as const;

function GoPage() {
  return (
    <div className="min-h-screen bg-warm-gradient">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/go" className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="Nehemiah's Temple logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg bg-warm/60 p-1"
            />
            <div className="leading-tight">
              <div className="font-display text-base font-semibold text-foreground sm:text-lg">
                {churchInfo.shortName}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary/80">
                Tap Hub
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-warm text-foreground" }}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/75 hover:bg-warm/70 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/admin"
            aria-label="Staff sign in"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-warm/70 text-foreground/70 hover:bg-warm hover:text-foreground"
          >
            <ShieldCheck className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        {/* Hero */}
        <section
          aria-labelledby="hero-title"
          className="relative overflow-hidden rounded-3xl shadow-lift"
        >
          <img
            src={heroImage}
            alt="Nehemiah's Temple sanctuary"
            width={1920}
            height={1080}
            className="h-64 w-full object-cover sm:h-80 md:h-96"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <h1
              id="hero-title"
              className="font-display text-2xl font-semibold leading-tight text-white drop-shadow-sm sm:text-4xl"
            >
              {churchInfo.name}
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">
              {churchInfo.tagline}
            </p>
          </div>
        </section>

        {/* Welcome */}
        <section className="mt-10 text-center sm:mt-12">
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Welcome! <span aria-hidden>👋</span>
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Choose an option below to get started
          </p>
        </section>

        {/* Action Cards */}
        <section className="mt-6 space-y-3" aria-label="Tap menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const accent =
              item.tone === "primary"
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground";
            return (
              <Link
                key={item.to}
                to={item.to}
                className="tap-card flex items-center gap-4 p-4 sm:gap-5 sm:p-5"
              >
                <div
                  className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${accent}`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-lg font-semibold text-foreground sm:text-xl">
                    {item.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.description}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </section>

        {/* Service Times */}
        <section
          aria-labelledby="service-times-title"
          className="mt-10 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2
              id="service-times-title"
              className="font-display text-xl font-semibold text-foreground"
            >
              Service Times
            </h2>
          </div>
          <ul className="divide-y divide-border">
            {serviceTimes.map((s) => (
              <li
                key={`${s.day}-${s.time}`}
                className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="font-medium text-foreground">{s.day}</div>
                  <div className="text-sm text-muted-foreground">{s.title}</div>
                </div>
                <div className="font-display text-base font-semibold text-primary">
                  {s.time}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Scripture */}
        <div className="mt-8 rounded-2xl border border-border/70 bg-card/60 p-5 text-center shadow-soft">
          <p className="text-sm italic text-muted-foreground">
            "How beautiful upon the mountains are the feet of him that bringeth good tidings…"
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary/80">
            Isaiah 52:7
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-background/40">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          <div className="flex flex-col items-center justify-center gap-1.5 sm:flex-row sm:gap-4">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {churchInfo.address}
            </span>
            <span className="hidden sm:inline" aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {churchInfo.phone}
            </span>
          </div>
          <div className="mt-2">© {new Date().getFullYear()} {churchInfo.shortName} · Tap Hub</div>
        </div>
      </footer>
    </div>
  );
}
