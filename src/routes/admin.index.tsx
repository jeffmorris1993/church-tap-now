import { createFileRoute, Link } from "@tanstack/react-router";
import { events, announcements, STATUS_LABEL } from "@/lib/content";
import { CalendarDays, Megaphone, CheckSquare, FileEdit } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const pending = [
    ...events.filter((e) => e.status === "pending"),
    ...announcements.filter((a) => a.status === "pending"),
  ];
  const drafts = [
    ...events.filter((e) => e.status === "draft"),
    ...announcements.filter((a) => a.status === "draft"),
  ];
  const published = events.filter((e) => e.status === "published").length +
    announcements.filter((a) => a.status === "published").length;

  const stats = [
    { label: "Pending review", value: pending.length, icon: CheckSquare, to: "/admin/approvals" },
    { label: "Drafts", value: drafts.length, icon: FileEdit, to: "/admin/events" },
    { label: "Events", value: events.length, icon: CalendarDays, to: "/admin/events" },
    { label: "Announcements", value: announcements.length, icon: Megaphone, to: "/admin/announcements" },
    { label: "Published live", value: published, icon: CheckSquare, to: "/admin/approvals" },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">A quick look at content across Tap Hub.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} to={s.to} className="tap-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <div className="mt-3 font-display text-3xl font-semibold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Link>
          );
        })}
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold">Awaiting review</h2>
        {pending.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-soft">
            Nothing pending. You're all caught up.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {STATUS_LABEL[item.status]}
                  </div>
                </div>
                <Link
                  to="/admin/approvals"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
