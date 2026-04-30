import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import {
  CheckCircle2,
  ShieldCheck,
  Menu,
  Check,
} from "lucide-react";
import heroImage from "@/assets/leadership-hero.jpg";
import { churchInfo } from "@/lib/content";

export const Route = createFileRoute("/new")({
  head: () => ({
    meta: [
      { title: "I'm New · Tap Hub" },
      {
        name: "description",
        content:
          "First time at Nehemiah's Temple? Say hi and we'll connect with you this week.",
      },
      { property: "og:title", content: "I'm New · Tap Hub" },
      {
        property: "og:description",
        content: "Come As You Are and Change As You Come.",
      },
      { property: "og:image", content: heroImage },
    ],
  }),
  component: NewPage,
});

const INTERESTS = [
  "Connect with a small group",
  "Learn about membership",
  "Volunteer opportunities",
  "Youth / Kids ministry",
  "Prayer / pastoral care",
  "Events updates",
] as const;

type Interest = (typeof INTERESTS)[number];
type FirstTime = "yes" | "before";

const schema = z.object({
  name: z.string().trim().min(1, "Please share your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  first_time: z.enum(["yes", "before"], {
    message: "Please choose one",
  }),
  interests: z.array(z.string().max(60)).max(20),
});

function Hero() {
  return (
    <div className="relative h-[140px] w-full overflow-hidden sm:h-[160px]">
      <img
        src={heroImage}
        alt="Nehemiah's Temple leadership"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#c4956c]/40 to-[#8b6f47]/40"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center">
        <h1 className="text-xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] sm:text-2xl">
          We're glad you're here!
        </h1>
        <p className="text-xs text-white/95 drop-shadow-[0_3px_3px_rgba(0,0,0,0.12)] sm:text-sm">
          "Come As You Are and Change As You Come"
        </p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
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
        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            aria-label="Admin"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[#4a5565] hover:bg-[#f9fafb]"
          >
            <ShieldCheck className="h-5 w-5" />
          </Link>
          <Link
            to="/go"
            aria-label="Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[#4a5565] hover:bg-[#f9fafb]"
          >
            <Menu className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function NewPage() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [firstTime, setFirstTime] = useState<FirstTime | "">("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const canSubmit =
    name.trim().length > 0 && email.trim().length > 0 && firstTime !== "";

  function reset() {
    setDone(false);
    setName("");
    setEmail("");
    setPhone("");
    setFirstTime("");
    setInterests([]);
    setErrors({});
  }

  function toggleInterest(i: Interest) {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = schema.safeParse({
      name,
      email,
      phone,
      first_time: firstTime,
      interests,
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || undefined,
          first_time: parsed.data.first_time === "yes",
          interests: parsed.data.interests,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setErrors({
          form: json.error || "Something went wrong. Please try again.",
        });
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      setDone(true);
    } catch (err) {
      console.error("visitor submit failed", err);
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <Hero />
        <main className="mx-auto max-w-[640px] px-4 pt-8 pb-12">
          <section
            aria-labelledby="thanks-title"
            className="rounded-2xl border border-[#f3f4f6] bg-white p-8 text-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#16a34a]/10">
              <Check className="h-8 w-8 text-[#16a34a]" strokeWidth={3} />
            </div>
            <h2
              id="thanks-title"
              className="mt-6 text-2xl font-bold text-[#101828]"
            >
              Thank you!
            </h2>
            <p className="mx-auto mt-3 max-w-[295px] text-base text-[#4a5565]">
              Someone from our team will reach out to you this week. We can't
              wait to meet you in person!
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/go" })}
              className="mt-6 w-full rounded-full bg-[#c4956c] px-6 py-3 text-base font-semibold text-white shadow-[0_10px_15px_0_rgba(0,0,0,0.1),0_4px_6px_0_rgba(0,0,0,0.1)] hover:bg-[#b3855c]"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={reset}
              className="mt-3 text-sm font-medium text-[#c4956c] hover:underline"
            >
              Submit another
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <Hero />
      <main className="mx-auto max-w-[640px] px-4 pt-6 pb-32 sm:pb-12">
        <form onSubmit={onSubmit} noValidate>
          <div className="rounded-2xl bg-white p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
            <div className="space-y-6">
              <FieldText
                label="Your Name"
                name="name"
                required
                value={name}
                onChange={setName}
                placeholder="Jane Doe"
                error={errors.name}
              />
              <div>
                <FieldText
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  error={errors.email}
                />
                <p className="mt-2 text-xs text-[#6a7282]">
                  We'll only use this to follow up—no spam.
                </p>
              </div>
              <FieldText
                label="Phone Number (optional)"
                name="phone"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="(555) 123-4567"
                error={errors.phone}
              />

              {/* First time segmented control */}
              <fieldset>
                <legend className="mb-2 block text-sm font-medium text-[#364153]">
                  Is this your first time visiting?{" "}
                  <span className="text-[#c4956c]">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-4">
                  <SegmentButton
                    selected={firstTime === "yes"}
                    onClick={() => setFirstTime("yes")}
                  >
                    Yes, first time
                  </SegmentButton>
                  <SegmentButton
                    selected={firstTime === "before"}
                    onClick={() => setFirstTime("before")}
                  >
                    I've been before
                  </SegmentButton>
                </div>
                {errors.first_time && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.first_time}
                  </p>
                )}
              </fieldset>

              {/* Interests */}
              <fieldset>
                <legend className="mb-3 block text-sm font-medium text-[#364153]">
                  I'm interested in{" "}
                  <span className="text-[#6a7282]">(select all that apply)</span>
                </legend>
                <div className="space-y-2">
                  {INTERESTS.map((interest) => {
                    const checked = interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        aria-pressed={checked}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-[14px] border-2 px-3.5 py-3 text-left text-base font-medium transition-colors"
                        style={{
                          borderColor: checked ? "#c4956c" : "#e5e7eb",
                          backgroundColor: checked
                            ? "rgba(196,149,108,0.1)"
                            : "#ffffff",
                          color: checked ? "#c4956c" : "#364153",
                        }}
                      >
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2"
                          style={{
                            borderColor: checked ? "#c4956c" : "#d1d5db",
                            backgroundColor: checked ? "#c4956c" : "#ffffff",
                          }}
                        >
                          {checked && (
                            <Check
                              className="h-3.5 w-3.5 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </span>
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>

          {/* Desktop submit */}
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="mt-4 hidden w-full rounded-2xl bg-[#c4956c] px-6 py-4 text-lg font-bold text-white shadow-[0_10px_15px_0_rgba(0,0,0,0.1),0_4px_6px_0_rgba(0,0,0,0.1)] transition-colors hover:bg-[#b3855c] disabled:opacity-50 sm:block"
          >
            {submitting ? "Connecting…" : "Connect with Us"}
          </button>
        </form>
      </main>

      {/* Sticky mobile submit */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e5e7eb] bg-white/95 px-4 pt-3 backdrop-blur sm:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
      >
        <button
          type="button"
          form=""
          onClick={(e) => {
            const form = (e.currentTarget.closest("body")?.querySelector(
              "form",
            ) as HTMLFormElement | null);
            form?.requestSubmit();
          }}
          disabled={!canSubmit || submitting}
          className="w-full rounded-2xl bg-[#c4956c] px-6 py-4 text-base font-bold text-white shadow-[0_10px_15px_0_rgba(0,0,0,0.1),0_4px_6px_0_rgba(0,0,0,0.1)] transition-colors hover:bg-[#b3855c] disabled:opacity-50"
        >
          {submitting ? "Connecting…" : "Connect with Us"}
        </button>
      </div>
    </div>
  );
}

function FieldText({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#364153]"
      >
        {label} {required && <span className="text-[#c4956c]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={255}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[14px] border-2 border-[#e5e7eb] bg-white px-4 py-3 text-base text-[#101828] placeholder:text-[#0a0a0a]/50 outline-none focus:border-[#c4956c]"
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SegmentButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="h-[52px] rounded-[14px] border-2 text-base font-medium transition-colors"
      style={{
        borderColor: selected ? "#c4956c" : "#e5e7eb",
        backgroundColor: selected ? "rgba(196,149,108,0.1)" : "#ffffff",
        color: selected ? "#c4956c" : "#364153",
        fontWeight: selected ? 600 : 500,
      }}
    >
      {children}
    </button>
  );
}
