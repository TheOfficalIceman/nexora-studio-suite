import { SignInButton, SignedIn, SignedOut, UserProfile, useClerk, useUser } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MC_VERSIONS } from "@/config/tools";
import { useTheme, type ThemeMode } from "@/lib/theme";
import { loadPrefs, savePrefs, type EditorPrefs } from "@/lib/prefs";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nexora" },
      {
        name: "description",
        content: "Choose your Nexora theme, default Minecraft version, grid and autosave preferences, and manage your account.",
      },
      { property: "og:title", content: "Settings — Nexora" },
      { property: "og:description", content: "Appearance, account and editor preferences for Nexora." },
    ],
  }),
  component: SettingsPage,
});

const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [prefs, setPrefs] = useState<EditorPrefs>(() => ({
    defaultVersion: "1.21",
    autosave: true,
    showGrid: true,
    pixelSize: 16,
  }));

  useEffect(() => setPrefs(loadPrefs()), []);

  const update = (patch: Partial<EditorPrefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePrefs(next);
    toast.success("Preferences saved");
  };

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Appearance, account and editor defaults.
        </p>
      </header>

      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="mt-4">
          <div className="surface-card max-w-2xl p-5">
            <h2 className="font-display text-base font-semibold">Theme</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your choice is remembered on this device.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const active = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all ${
                      active
                        ? "border-primary bg-accent text-accent-foreground shadow-[var(--shadow-glow)]"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="size-4" /> {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-4">
          <div className="surface-card max-w-2xl space-y-5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-semibold">Default Minecraft version</Label>
                <p className="text-xs text-muted-foreground">
                  Used by the command generator and texture pack maker.
                </p>
              </div>
              <Select
                value={prefs.defaultVersion}
                onValueChange={(v) => update({ defaultVersion: v })}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MC_VERSIONS.map((v) => (
                    <SelectItem key={v} value={v}>
                      Java {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-semibold">Autosave</Label>
                <p className="text-xs text-muted-foreground">
                  Save edits automatically while you work.
                </p>
              </div>
              <Switch checked={prefs.autosave} onCheckedChange={(v) => update({ autosave: v })} />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-semibold">Show grid by default</Label>
                <p className="text-xs text-muted-foreground">
                  Applies to skin, pixel art and build editors.
                </p>
              </div>
              <Switch checked={prefs.showGrid} onCheckedChange={(v) => update({ showGrid: v })} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="mt-4">
          <SignedOut>
            <div className="surface-card max-w-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Sign in to sync your creations across devices.
              </p>
              <SignInButton mode="modal">
                <Button className="mt-3">Sign in to Nexora</Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="surface-card mb-4 flex flex-wrap items-center gap-4 p-5">
              <img
                src={user?.imageUrl}
                alt=""
                className="size-12 rounded-full border border-border"
              />
              <div>
                <p className="font-display font-semibold">{user?.fullName ?? user?.username}</p>
                <p className="text-sm text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              <Button
                variant="secondary"
                className="ml-auto"
                onClick={() => void signOut({ redirectUrl: "/" })}
              >
                <LogOut className="size-4" /> Sign out
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <UserProfile routing="hash" />
            </div>
          </SignedIn>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
