import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Blocks,
  Boxes,
  Compass,
  LayoutDashboard,
  Menu,
  Moon,
  Palette,
  Settings,
  Shirt,
  Sparkles,
  Sun,
  Terminal,
  Flag,
  Grid3x3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NexoraWordmark } from "@/components/Logo";
import { GlobalSearch, SearchTrigger } from "@/components/GlobalSearch";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const toolIcons = {
  "/tools/skin": Shirt,
  "/tools/texture-pack": Boxes,
  "/tools/command": Terminal,
  "/tools/banner": Flag,
  "/tools/build": Blocks,
  "/tools/pixel-art": Grid3x3,
} as const;

const mainNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/creations", label: "My Creations", icon: Palette },
  { to: "/nexora-projects", label: "Nexora Projects", icon: Compass },
  { to: "/settings", label: "Settings", icon: Settings },
];

const toolNav = [
  { to: "/tools/skin", label: "Skin Editor" },
  { to: "/tools/texture-pack", label: "Texture Pack" },
  { to: "/tools/command", label: "Commands" },
  { to: "/tools/banner", label: "Banner" },
  { to: "/tools/build", label: "Build Planner" },
  { to: "/tools/pixel-art", label: "Pixel Art" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const item = (to: string, label: string, Icon: React.ComponentType<{ className?: string }>) => {
    const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
    return (
      <Link
        key={to}
        to={to}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_var(--primary)]"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
        )}
      >
        <Icon className={cn("size-4", active && "text-primary")} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-1">
      {mainNav.slice(0, 3).map((n) => item(n.to, n.label, n.icon))}
      <p className="mt-5 px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        Creation tools
      </p>
      {toolNav.map((n) => item(n.to, n.label, toolIcons[n.to as keyof typeof toolIcons]))}
      <div className="mt-5">{item("/settings", "Settings", Settings)}</div>
    </nav>
  );
}

function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} mode`}
      className="relative"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar px-3 py-4 lg:flex">
        <Link to="/" className="px-2 pb-6">
          <NexoraWordmark />
        </Link>
        <NavLinks />
        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold">
            <Sparkles className="size-3.5 text-primary" /> Nexora AI
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Another project from the Nexora team.
          </p>
          <a
            href="https://ai.nexoras.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
          >
            Open project →
          </a>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-3">
              <SheetTitle className="sr-only">Nexora navigation</SheetTitle>
              <div className="px-2 pb-6 pt-2">
                <NexoraWordmark />
              </div>
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link to="/" className="lg:hidden">
            <NexoraWordmark className="[&_span:last-child]:hidden sm:[&_span:last-child]:inline" />
          </Link>

          <div className="hidden flex-1 sm:flex">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Compass className="size-4" />
            </Button>
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
            </SignedIn>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">{children}</main>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
