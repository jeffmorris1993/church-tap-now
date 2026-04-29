import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  events as seedEvents,
  announcements as seedAnns,
  type EventItem,
  type Announcement,
  type ContentStatus,
} from "@/lib/content";
import { StatusPill } from "./admin.events";
import { Check, X, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/admin/approvals")({
  component: AdminApprovals;
});

type Item =
  | ({ kind: "event" } & EventItem)
  | ({ kind: "announcement" } & Announcement);

function AdminApprovals() {
  const [items, setItems] = useState<Item[]>([
    ...seedEvents.map((e) => ({ kind: "event" as const, ...e })),
    ...seedAnns.map((a) => ({ kind: "announcement" as const, ...a })),
  ]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  function setStatus(id: string, status: ContentStatus, note?: string) {
    setItems((l) =>
      l.map((it) => (it.id === id ? { ...it, status, reviewerNote: note } : it)),
    );
  }

  const visible = items.filter((i) => (filter === "pending" ? i.status === "pending" : true));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Approvals</h1>
          <p className="mt-1 text-muted-foreground">Review submissions and publish.</p>
        </div>
        <div className="flex gap-1 rounded-full bg-warm p-1">
          {(["pending", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-warm-foreground"
              }`}
            >
              {f === "pending" ? "Pending" : "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {visible.length === 0 && (
          <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-soft">
            Nothing here. Great work, team.
          </p>
        )}
        {visible.map((it) => (
          <div key={it.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary/80">
                  {it.kind}
                </div>
                <h3 className="font-display text-lg font-semibold">{it.title}</h3>
                {it.kind === "event" && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(it.startsAt).toLocaleString()} · {it.location}
                  </p>
                )}
              </div>
              <StatusPill status={it.status} />
            </div>
            <p className="mt-2 text-sm text-foreground/80">
              {it.kind === "event" ? it.description : it.body}
            </p>
            {it.reviewerNote && (
              <p className="mt-2 rounded-xl bg-warm p-3 text-sm text-warm-foreground">
                <strong>Note:</strong> {it.reviewerNote}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {it.status === "pending" && (
                <>
                  <button
                    onClick={() => setStatus(it.id, "published")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-success px-3.5 py-2 text-sm font-semibold text-success-foreground hover:opacity-90"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve & publish
                  </button>
                  <button
                    onClick={() => {
                      const note = window.prompt("What needs to change?") || undefined;
                      setStatus(it.id, "needs_changes", note);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3.5 py-2 text-sm font-semibold text-destructive hover:bg-destructive/20"
                  >
                    <X className="h-3.5 w-3.5" /> Request changes
                  </button>
                </>
              )}
              {it.status === "published" && (
                <button
                  onClick={() => setStatus(it.id, "archived")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-warm px-3.5 py-2 text-sm font-medium text-warm-foreground hover:bg-accent"
                >
                  Archive
                </button>
              )}
              {it.status === "archived" && (
                <button
                  onClick={() => setStatus(it.id, "draft")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-warm px-3.5 py-2 text-sm font-medium text-warm-foreground hover:bg-accent"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Restore to draft
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
