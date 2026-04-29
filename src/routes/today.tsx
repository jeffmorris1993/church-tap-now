import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { todaySchedule, announcements } from "@/lib/content";
import { Pin } from "lucide-react";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today · Tap Hub" },
      { name: "description", content: "Today's service schedule and announcements at Nehemiah's Temple." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const published = announcements
    .filter((a) => a.status === "published")
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));

  return (
    <PageShell title="Today" subtitle="Here's what's happening this morning.">
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary/80">
          Schedule
        </h2>
        <ol className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {todaySchedule.map((s, i) => (
            <li
              key={s.time}
              className={`flex items-start gap-4 p-4 ${
                i !== 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="w-20 shrink-0 font-display text-sm font-semibold text-primary">
                {s.time}
              </div>
              <div>
                <div className="font-medium text-foreground">{s.title}</div>
                {s.detail && (
                  <div className="text-sm text-muted-foreground">{s.detail}</div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary/80">
          Announcements
        </h2>
        <div className="space-y-3">
          {published.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <div className="flex items-center gap-2">
                {a.pinned && <Pin className="h-4 w-4 text-primary" />}
                <h3 className="font-display text-lg font-semibold">{a.title}</h3>
              </div>
              <p className="mt-1 text-sm text-foreground/80">{a.body}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
