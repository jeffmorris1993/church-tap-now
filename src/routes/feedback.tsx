import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback & Prayer · Tap Hub" },
      { name: "description", content: "Share feedback or submit a prayer request." },
    ],
  }),
  component: FeedbackPage,
});

const schema = z.object({
  type: z.enum(["feedback", "prayer"]),
  name: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(3, "Please add a few words").max(2000),
  isPrivate: z.string().optional(),
});

function FeedbackPage() {
  const [type, setType] = useState<"feedback" | "prayer">("prayer");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your message");
      return;
    }
    setError(null);
    // TODO: POST to backend
    setDone(true);
  }

  if (done) {
    return (
      <PageShell title="Thank you" subtitle="We received your message.">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <p className="mt-3 font-display text-xl font-semibold">
            {type === "prayer" ? "We're praying with you." : "Thanks for sharing."}
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Feedback & Prayer" subtitle="We'd love to hear from you.">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="grid grid-cols-2 gap-2 rounded-full bg-warm p-1">
          {(["prayer", "feedback"] as const).map((t) => (
            <label
              key={t}
              className={`cursor-pointer rounded-full py-2 text-center text-sm font-medium transition-colors ${
                type === t
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-warm-foreground"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="sr-only"
              />
              {t === "prayer" ? "Prayer request" : "Feedback"}
            </label>
          ))}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Your name <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            name="name"
            maxLength={100}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {type === "prayer" ? "How can we pray?" : "Your message"}{" "}
            <span className="text-primary">*</span>
          </label>
          <textarea
            name="message"
            rows={5}
            maxLength={2000}
            required
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
          />
        </div>

        {type === "prayer" && (
          <label className="flex items-center gap-2 text-sm text-foreground/80">
            <input type="checkbox" name="isPrivate" className="h-4 w-4 rounded border-input" />
            Keep this private to the prayer team
          </label>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
        >
          Send
        </button>
      </form>
    </PageShell>
  );
}
