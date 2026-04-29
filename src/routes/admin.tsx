import { createFileRoute, Outlet, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isAdmin, signIn, signOut } from "@/lib/auth";
import { LayoutDashboard, CalendarDays, Megaphone, CheckSquare, LogOut, Home } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Tap Hub" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAuthed(isAdmin());
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!authed) return <SignInForm onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-warm-gradient">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="font-display text-lg font-semibold">
            Tap Hub <span className="text-primary">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/go"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-warm"
            >
              <Home className="h-4 w-4" /> Public
            </Link>
            <button
              onClick={() => {
                signOut();
                setAuthed(false);
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
    { to: "/admin/events", label: "Events", icon: CalendarDays },
    { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { to: "/admin/approvals", label: "Approvals", icon: CheckSquare },
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

function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-gradient px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (signIn(pw)) onSuccess();
          else setErr("That password didn't match. Try again.");
        }}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-lift"
      >
        <h1 className="font-display text-2xl font-semibold">Staff sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your Tap Hub staff password.
        </p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
          placeholder="Password"
          className="mt-4 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
        />
        {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
        >
          Sign in
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Hint for demo: <code className="font-mono">shalom</code>
        </p>
      </form>
    </div>
  );
}
