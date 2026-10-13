import { Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "lime" | "tomato" | "violet" | "mint" | "sky" | "sun" | "dark" | "danger";
  className?: string;
}) {
  const tones = {
    neutral: "bg-paper-deep text-ink",
    lime: "bg-lime text-ink",
    tomato: "bg-tomato-soft text-tomato-deep",
    violet: "bg-violet-soft text-violet-deep",
    mint: "bg-mint-soft text-mint-deep",
    sky: "bg-sky-soft text-sky-deep",
    sun: "bg-sun-soft text-sun-deep",
    dark: "bg-ink text-paper",
    danger: "bg-danger-soft text-danger",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold leading-none", tones[tone], className)}>
      {children}
    </span>
  );
}

/** Puce sélectionnable (filtres, questionnaire). */
export function Chip({
  selected,
  onClick,
  children,
  className,
  ...rest
}: { selected: boolean; onClick: () => void; children: React.ReactNode; className?: string } & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
>) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-tap items-center gap-2 whitespace-nowrap rounded-full border-2 px-4 text-sm font-semibold transition active:scale-[0.97]",
        selected ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink hover:border-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ProgressBar({
  value,
  max = 100,
  label,
  tone = "lime",
  className,
}: {
  value: number;
  max?: number;
  label: string;
  tone?: "lime" | "violet" | "sky" | "sun" | "tomato" | "mint";
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const tones = { lime: "bg-lime", violet: "bg-violet", sky: "bg-sky", sun: "bg-sun", tomato: "bg-tomato", mint: "bg-mint" };
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      className={cn("h-3 w-full overflow-hidden rounded-full bg-ink/10", className)}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-500 ease-out", tones[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  className,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <As className={cn("font-display font-extrabold tracking-tight", As === "h1" ? "text-display-lg" : "text-2xl")}>{title}</As>
      </div>
      {action}
    </div>
  );
}

/** Mention obligatoire sur toute donnée nutritionnelle. */
export function EstimateNote({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 text-xs leading-snug text-ink-muted", className)}>
      <Info aria-hidden className="mt-px size-3.5 shrink-0" />
      <span>
        Estimations de démonstration, non validées par une source officielle (p. ex. Fichier canadien sur les éléments
        nutritifs). Ne remplacent pas l&apos;avis d&apos;un professionnel de la santé.
      </span>
    </p>
  );
}

export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-10 text-center">
      {icon && <div className="flex size-14 items-center justify-center rounded-full bg-lime text-ink">{icon}</div>}
      <h2 className="text-xl font-extrabold">{title}</h2>
      {children && <div className="max-w-md text-ink-muted">{children}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-card bg-ink/[0.07]", className)} />;
}
