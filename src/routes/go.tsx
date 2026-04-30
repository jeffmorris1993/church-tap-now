import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Bell,
  Users,
  HandHeart,
  UserPlus,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import heroImage from "@/assets/leadership-hero.jpg";
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
  /** Tailwind gradient classes from→to, sampled from the Figma design */
  gradient: string;
}

const menuItems: MenuItem[] = [
  {
    to: "/new",
    title: "I'm New Here",
    description: "Connect with us",
    icon: UserPlus,
    gradient: "from-[#8b6f47] to-[#6b5635]",
  },
  {
    to: "/today",
    title: "Today at Nehemiah",
    description: "Announcements & schedule",
    icon: Bell,
    gradient: "from-[#c4956c] to-[#8b6f47]",
  },
  {
    to: "/events",
    title: "Events & Signups",
    description: "What's coming up",
    icon: Calendar,
    gradient: "from-[#6b4423] to-[#4a2f18]",
  },
  {
    to: "/kids",
    title: "Kids + Youth Hub",
    description: "For families",
    icon: Users,
    gradient: "from-[#9b7d54] to-[#7b5d34]",
  },
  {
    to: "/give",
    title: "Give",
    description: "Support the ministry",
    icon: HandHeart,
    gradient: "from-[#a37e5a] to-[#836342]",
  },
  {
    to: "/feedback",
    title: "Feedback / Prayer",
    description: "We're here for you",
    icon: MessageSquare,
    gradient: "from-[#d4a574] to-[#b48a5c]",
  },
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
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <Link to="/go" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c4956c]">
              <span className="text-base font-bold text-white tracking-tight">
                NT
              </span>
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold text-[#101828]">
                {churchInfo.shortName}
              </div>
              <div className="text-xs text-[#6a7282]">Tap Hub</div>
            </div>
          </Link>

          {/* Admin button (center on desktop) */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-[10px] px-2 py-2 text-sm font-medium text-[#4a5565] hover:bg-[#f9fafb]"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Admin</span>
          </Link>

          {/* Primary nav */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-[#101828]" }}
                className="text-base font-medium text-[#364153] hover:text-[#101828]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[640px] px-4 pt-8 pb-8">
        {/* Hero */}
        <section
          aria-labelledby="hero-title"
          className="relative overflow-hidden rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
        >
          <img
            src={heroImage}
            alt="Nehemiah's Temple leadership"
            width={1280}
            height={640}
            className="h-80 w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 px-8 pt-8 pb-6">
            <h1
              id="hero-title"
              className="text-[36px] font-bold leading-[40px] text-white"
            >
              {churchInfo.name}
            </h1>
            <p className="mt-2 text-lg font-medium text-white/95">
              {churchInfo.tagline}
            </p>
          </div>
        </section>

        {/* Welcome */}
        <section className="mt-8 text-center">
          <h2 className="text-[30px] font-bold leading-9 text-[#101828]">
            Welcome! <span aria-hidden>👋</span>
          </h2>
          <p className="mt-2 text-lg text-[#4a5565]">
            Choose an option below to get started
          </p>
        </section>

        {/* Action Cards */}
        <section className="mt-8 space-y-4" aria-label="Tap menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex h-[108px] items-center gap-4 rounded-2xl border-2 border-[#f3f4f6] bg-white px-5 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] transition-transform active:scale-[0.99]"
              >
                <div
                  className={`inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-b ${item.gradient} shadow-[0_10px_15px_0_rgba(0,0,0,0.1),0_4px_6px_0_rgba(0,0,0,0.1)]`}
                >
                  <Icon className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-bold text-[#101828]">
                    {item.title}
                  </div>
                  <div className="text-sm text-[#4a5565]">
                    {item.description}
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 shrink-0 text-[#99a1af]" />
              </Link>
            );
          })}
        </section>

        {/* Service Times */}
        <section
          aria-labelledby="service-times-title"
          className="mt-8 rounded-3xl bg-white px-6 pt-6 pb-6 shadow-[0_20px_25px_0_rgba(0,0,0,0.1),0_8px_10px_0_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#c4956c]" />
            <h2
              id="service-times-title"
              className="text-lg font-bold text-[#101828]"
            >
              Service Times
            </h2>
          </div>
          <ul className="mt-4 space-y-3">
            {serviceTimes.map((s) => (
              <li
                key={`${s.day}-${s.time}`}
                className="flex h-[68px] items-center justify-between rounded-[14px] bg-[#f9fafb] px-3"
              >
                <div>
                  <div className="text-base font-semibold text-[#101828]">
                    {s.day}
                  </div>
                  <div className="text-sm text-[#4a5565]">{s.title}</div>
                </div>
                <div className="text-base font-bold text-[#c4956c]">
                  {s.time}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Address + phone */}
        <div className="mt-8 space-y-1 text-center">
          <p className="text-sm text-[#6a7282]">{churchInfo.address}</p>
          <p className="text-sm text-[#6a7282]">{churchInfo.phone}</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-4">
          <Link
            to="/feedback"
            className="text-sm text-[#c4956c] hover:underline"
          >
            Need help?
          </Link>
        </div>
      </footer>
    </div>
  );
}
