import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Baby, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/kids")({
  head: () => ({
    meta: [
      { title: "Kids & Youth · Tap Hub" },
      { name: "description", content: "Kids and youth ministry info and activities at Nehemiah's Temple." },
    ],
  }),
  component: KidsPage,
});

const groups = [
  { name: "Little Lights", age: "Ages 0–4", room: "Room 101", icon: Baby },
  { name: "Kids Alive", age: "Ages 5–10", room: "Room 110", icon: Sparkles },
  { name: "Youth Ignite", age: "Ages 11–17", room: "Youth Center", icon: Users },
];

const activities = [
  { title: "Memory Verse", body: '"Let the little children come to me." — Mark 10:14' },
  { title: "Today's Lesson", body: "The Good Samaritan — what does it mean to be a neighbor?" },
  { title: "Try at home", body: "Draw a picture of a way you can help someone this week." },
];

function KidsPage() {
  return (
    <PageShell title="Kids & Youth" subtitle="Safe, fun spaces for every age.">
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary/80">
          Where to go
        </h2>
        <div className="space-y-3">
          {groups.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.name}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-lg font-semibold">{g.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {g.age} · {g.room}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary/80">
          This week's activities
        </h2>
        <div className="space-y-3">
          {activities.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <div className="font-display text-lg font-semibold">{a.title}</div>
              <p className="mt-1 text-sm text-foreground/80">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 rounded-2xl bg-warm p-4 text-center text-sm text-warm-foreground">
        Check-in at the Children's Wing desk on your first visit. Every child gets a
        secure pickup tag.
      </p>
    </PageShell>
  );
}
