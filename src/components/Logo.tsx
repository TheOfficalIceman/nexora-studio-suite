import { cn } from "@/lib/utils";

export function NexoraMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-grid size-9 shrink-0 place-items-center rounded-[10px] shadow-[var(--shadow-glow)]",
        className,
      )}
      style={{ background: "var(--gradient-brand)" }}
      aria-hidden
    >
      <span className="grid grid-cols-2 gap-[3px]">
        <span className="size-[7px] rounded-[2px] bg-background/90" />
        <span className="size-[7px] rounded-[2px] bg-background/40" />
        <span className="size-[7px] rounded-[2px] bg-background/40" />
        <span className="size-[7px] rounded-[2px] bg-background/90" />
      </span>
    </span>
  );
}

export function NexoraWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <NexoraMark />
      <span className="font-display text-xl font-bold tracking-tight">
        Nex<span className="brand-gradient-text">ora</span>
      </span>
    </span>
  );
}
