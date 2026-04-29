import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { events as seed, type EventItem, type ContentStatus, STATUS_LABEL } from "@/lib/content";
import { Plus, Send } from "lucide-react";

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
});

function AdminEvents() {
  const [list, setList] = useState<EventItem[]>(seed);
  const [adding, setAdding] = useState(false);

  function update(id: string, patch: Partial<EventItem>) {
    setList((l) => l.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addDraft(form: FormData) {
    const id = `evt-${Date.now()}`;
    const next: EventItem = {
      id,
      title: String(form.get("title") || "Untitled"),
      description: String(form.get("description") || ""),
      startsAt: String(form.get("startsAt") || new Date().toISOString()),
      location: String(form.get("location") || "TBD"),
      status: "draft",
      category: (form.get("category") as EventItem["category"]) || "fellowship",
    };
    setList((l) => [next, ...l]);
    setAdding(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Events</h1>
          <p className="mt-1 text-muted-foreground">Create drafts, then submit for approval.</p>
        </div>
        <button
          onClick={() => setAdding((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New event
        </button>
      </div>

      {adding && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addDraft(new FormData(e.currentTarget));
          }}
          className="mt-5 grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft sm:grid-cols-2"
        >
          <Input name="title" label="Title" required />
          <Input name="location" label="Location" />
          <Input name="startsAt" label="Starts at" type="datetime-local" required />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <select
              name="category"
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
            >
              {["worship", "kids", "youth", "outreach", "fellowship"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
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
        {list.map((e) => (
          <div key={e.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-semibold">{e.title}</h3>
                <div className="text-sm text-muted-foreground">
                  {new Date(e.startsAt).toLocaleString()} · {e.location}
                </div>
              </div>
              <StatusPill status={e.status} />
            </div>
            <p className="mt-2 text-sm text-foreground/80">{e.description}</p>
            {e.reviewerNote && (
              <p className="mt-2 rounded-xl bg-warm p-3 text-sm text-warm-foreground">
                <strong>Reviewer:</strong> {e.reviewerNote}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {(e.status === "draft" || e.status === "needs_changes") && (
                <button
                  onClick={() => update(e.id, { status: "pending", reviewerNote: undefined })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-3.5 w-3.5" /> Submit for approval
                </button>
              )}
              {e.status !== "archived" && (
                <button
                  onClick={() => update(e.id, { status: "archived" })}
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

function Input({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}{required && " *"}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
      />
    </div>
  );
}

export function StatusPill({ status }: { status: ContentStatus }) {
  const map: Record<ContentStatus, string> = {
    draft: "bg-warm text-warm-foreground",
    pending: "bg-accent text-accent-foreground",
    needs_changes: "bg-destructive/15 text-destructive",
    approved: "bg-primary/15 text-primary",
    published: "bg-success/20 text-success",
    archived: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${map[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
