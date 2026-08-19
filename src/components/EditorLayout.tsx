import type { ReactNode } from "react";

import { AppShell } from "@/components/AppShell";

export function EditorLayout({
  title,
  description,
  toolbar,
  children,
}: {
  title: string;
  description: string;
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AppShell>
      <header className="mb-4">
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      {toolbar}
      <div className="mt-4">{children}</div>
    </AppShell>
  );
}
