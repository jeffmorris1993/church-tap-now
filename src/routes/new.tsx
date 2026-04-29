import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/new")({
  head: () => ({
    meta: [
      { title: "I'm New · Tap Hub" },
      { name: "description", content: "First time at Nehemiah's Temple? Say hi and we'll connect with you." },
    ],
  }),
  component: NewPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please share your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  interest: z.string().max(500).optional().or(z.literal("")),
});

function NewPage() {
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    // TODO: POST to backend (FastAPI / Sheets) when wired
    setDone(true);
  }

  if (done) {
    return (
      <PageShell title="Welcome!" subtitle="We're so glad you're here.">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <p className="mt-3 font-display text-xl font-semibold">Thanks for saying hi.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Someone from our welcome team will reach out this week.
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="I'm New" subtitle="A quick hello so we can welcome you well.">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <Field label="Your name" name="name" error={errors.name} required />
        <Field label="Email" name="email" type="email" error={errors.email} required />
        <Field label="Phone (optional)" name="phone" type="tel" error={errors.phone} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            What brought you in? <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            name="interest"
            rows={3}
            maxLength={500}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
        >
          Say hello
        </button>
      </form>
    </PageShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={255}
        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
