import { Link } from "@tanstack/react-router";
import { ChevronLeft, Home } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  back?: boolean;
}

export function PageShell({ title, subtitle, children, back = true }: Props) {
  return (
    <div className="min-h-screen bg-warm-gradient">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          {back ? (
            <Link
              to="/go"
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-warm"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          ) : (
            <span className="font-display text-lg font-semibold">Tap Hub</span>
          )}
          <Link
            to="/go"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-warm text-foreground/80 hover:bg-accent"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </main>
      <footer className="pb-8 text-center text-xs text-muted-foreground">
        Nehemiah's Temple · Tap Hub
      </footer>
    </div>
  );
}
