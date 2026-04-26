import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, History, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Studio", icon: Sparkles },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div
            className="grid h-8 w-8 place-items-center rounded-lg shadow-[var(--shadow-glow)]"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Banner Studio</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              GPT Image · Coachio
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((n) => {
            const active = path === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{n.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}