import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { events } from "@/lib/content";
import { CalendarDays, MapPin } from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events · Tap Hub" },
      { name: "description", content: "Upcoming events and sign-ups at Nehemiah's Temple." },
    ],
  }),
  component: EventsPage,
});

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function EventsPage() {
  const list = events
    .filter((e) => e.status === "published")
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <PageShell title="Events" subtitle="What's coming up at Nehemiah's Temple.">
      <div className="space-y-4">
        {list.map((e) => (
          <article
            key={e.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl font-semibold">{e.title}</h3>
              <span className="rounded-full bg-warm px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-warm-foreground">
                {e.category}
              </span>
            </div>
            <p className="mt-2 text-sm text-foreground/80">{e.description}</p>
            <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                {fmt(e.startsAt)}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {e.location}
              </div>
            </div>
            {e.signupUrl && (
              <a
                href={e.signupUrl}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
              >
                Sign up
              </a>
            )}
          </article>
        ))}
        {list.length === 0 && (
          <p className="text-center text-muted-foreground">No upcoming events yet.</p>
        )}
      </div>
    </PageShell>
  );
}
