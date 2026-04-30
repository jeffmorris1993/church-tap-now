import { createFileRoute, Outlet, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { LayoutDashboard, CalendarDays, Megaphone, CheckSquare, LogOut, Home } from "lucide-react";

const ALLOWED_DOMAIN = "nehtemple.org";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Tap Hub" }] }),
  component: AdminLayout,
});

function emailDomain(email?: string | null) {
  if (!email) return null;
  const at = email.lastIndexOf("@");
  return at === -1 ? null : email.slice(at + 1).toLowerCase();
}

function AdminLayout() {
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Set up listener BEFORE getting session
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const userEmail = session?.user?.email ?? null;
      if (userEmail && emailDomain(userEmail) !== ALLOWED_DOMAIN) {
        // Not allowed — sign out immediately
        await supabase.auth.signOut();
        setEmail(null);
        setError(`Only @${ALLOWED_DOMAIN} accounts can sign in to admin.`);
      } else {
        setEmail(userEmail);
        if (userEmail) setError(null);
      }
      setChecked(true);
    });

    supabase.auth.getSession().then(async ({ data }) => {
      const userEmail = data.session?.user?.email ?? null;
      if (userEmail && emailDomain(userEmail) !== ALLOWED_DOMAIN) {
        await supabase.auth.signOut();
        setEmail(null);
        setError(`Only @${ALLOWED_DOMAIN} accounts can sign in to admin.`);
      } else {
        setEmail(userEmail);
      }
      setChecked(true);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!checked) return null;
  if (!email) return <SignInForm error={error} />;

  return (
    <div className="min-h-screen bg-warm-gradient">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="font-display text-lg font-semibold">
            Tap Hub <span className="text-primary">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
            <Link
              to="/go"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-warm"
            >
              <Home className="h-4 w-4" /> Public
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setEmail(null);
                router.invalidate();
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-warm"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
        <AdminNav />
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">
        <Outlet />
      </main>
    </div>
  );
}

function AdminNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/events", label: "Events", icon: CalendarDays, exact: false },
    { to: "/admin/announcements", label: "Announcements", icon: Megaphone, exact: false },
    { to: "/admin/approvals", label: "Approvals", icon: CheckSquare, exact: false },
  ] as const;
  return (
    <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3">
      {items.map((it) => {
        const active = it.exact ? path === it.to : path.startsWith(it.to);
        const Icon = it.icon;
        return (
          <Link
            key={it.to}
            to={it.to}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-card text-foreground/80 hover:bg-warm"
            }`}
          >
            <Icon className="h-4 w-4" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SignInForm({ error }: { error: string | null }) {
  const [busy, setBusy] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);

  async function handleGoogle() {
    setBusy(true);
    setLocalErr(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
      extraParams: {
        hd: ALLOWED_DOMAIN,
        prompt: "select_account",
      },
    });
    if (result.error) {
      setLocalErr(result.error.message || "Sign-in failed.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    // tokens received — auth listener will pick up the session
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-gradient px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-lift">
        <h1 className="font-display text-2xl font-semibold">Staff sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in with your <span className="font-medium">@{ALLOWED_DOMAIN}</span> Google account.
        </p>
        {(error || localErr) && (
          <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error || localErr}
          </p>
        )}
        <button
          onClick={handleGoogle}
          disabled={busy}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60"
        >
          {busy ? "Opening Google…" : "Continue with Google"}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Access is restricted to Nehemiah's Temple staff accounts.
        </p>
      </div>
    </div>
  );
}
