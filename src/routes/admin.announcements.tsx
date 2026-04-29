import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { announcements as seed, type Announcement } from "@/lib/content";
import { StatusPill } from "./admin.events";
import { Plus, Send, Pin } from "lucide-react";

export const Route = createFileRoute("/admin/announcements")({
  component: AdminAnnouncements,
});

function AdminAnnouncements() {
  const [list, setList] = useState<Announcement[]>(seed);
  const [adding, setAdding] = useState(false);

  function update(id: string, patch: Partial<Announcement>) {
    setList((l) => l.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function add(form: FormData) {
    const a: Announcement = {
      id: `ann-${Date.now()}`,
      title: String(form.get("title") || "Untitled"),
      body: String(form.get("body") || ""),
      status: "draft",
    };
    setList((l) => [a, ...l]);
    setAdding(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Announcements</h1>
          <p className="mt-1 text-muted-foreground">Short messages shown on Today.</p>
        </div>
        <button
          onClick={() => setAdding((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      {adding && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add(new FormData(e.currentTarget));
          }}
          className="mt-5 space-y-3 rounded-2xl border border-border bg-card p-5 shadow-soft"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium">Title *</label>
            <input
              name="title"
              required
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Body</label>
            <textarea
              name="body"
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAdding(false)} className="rounded-full px-4 py-2 text-sm font-medium hover:bg-warm">
              Cancel
            </button>
            <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Save draft
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {list.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {a.pinned && <Pin className="h-4 w-4 text-primary" />}
                <h3 className="font-display text-lg font-semibold">{a.title}</h3>
              </div>
              <StatusPill status={a.status} />
            </div>
            <p className="mt-1 text-sm text-foreground/80">{a.body}</p>
            {a.reviewerNote && (
              <p className="mt-2 rounded-xl bg-warm p-3 text-sm text-warm-foreground">
                <strong>Reviewer:</strong> {a.reviewerNote}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {(a.status === "draft" || a.status === "needs_changes") && (
                <button
                  onClick={() => update(a.id, { status: "pending", reviewerNote: undefined })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-3.5 w-3.5" /> Submit for approval
                </button>
              )}
              <button
                onClick={() => update(a.id, { pinned: !a.pinned })}
                className="rounded-full bg-warm px-3.5 py-2 text-sm font-medium text-warm-foreground hover:bg-accent"
              >
                {a.pinned ? "Unpin" : "Pin to top"}
              </button>
              {a.status !== "archived" && (
                <button
                  onClick={() => update(a.id, { status: "archived" })}
                  className="rounded-full bg-warm px-3.5 py-2 text-sm font-medium text-warm-foreground hover:bg-accent"
                >
                  Archive
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
