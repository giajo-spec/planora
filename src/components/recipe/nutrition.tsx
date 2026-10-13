import type { Nutrition } from "@/lib/domain/types";
import { roundNutrition } from "@/lib/nutrition/nutrition";
import { cn } from "@/lib/utils/cn";

const MACROS = [
  { key: "protein", label: "Protéines", short: "P", color: "bg-violet", text: "text-violet-deep" },
  { key: "carbs", label: "Glucides", short: "G", color: "bg-sky", text: "text-sky-deep" },
  { key: "fat", label: "Lipides", short: "L", color: "bg-sun", text: "text-sun-deep" },
] as const;

/** Grille calories + macros (valeurs arrondies). */
export function NutritionGrid({ nutrition, className }: { nutrition: Nutrition; className?: string }) {
  const n = roundNutrition(nutrition);
  return (
    <dl className={cn("grid grid-cols-2 gap-2", className)}>
      <div className="rounded-2xl bg-ink px-2 py-3 text-center text-paper">
        <dt className="text-[0.7rem] font-bold uppercase tracking-wider text-paper/75">Calories</dt>
        <dd className="font-display text-xl font-extrabold tabular-nums">{n.kcal}</dd>
      </div>
      {MACROS.map((m) => (
        <div key={m.key} className="rounded-2xl bg-paper px-2 py-3 text-center">
          <dt className={cn("text-[0.7rem] font-bold uppercase tracking-wider", m.text)}>{m.label}</dt>
          <dd className="font-display text-xl font-extrabold tabular-nums">
            {n[m.key]}
            <span className="text-sm font-bold"> g</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Barre empilée de répartition des macros (en calories). */
export function MacroBar({ nutrition, className }: { nutrition: Nutrition; className?: string }) {
  const kcal = { protein: nutrition.protein * 4, carbs: nutrition.carbs * 4, fat: nutrition.fat * 9 };
  const total = kcal.protein + kcal.carbs + kcal.fat || 1;
  const n = roundNutrition(nutrition);
  return (
    <div className={className}>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-ink/10" aria-hidden>
        {MACROS.map((m) => (
          <div key={m.key} className={m.color} style={{ width: `${(kcal[m.key] / total) * 100}%` }} />
        ))}
      </div>
      <p className="mt-1.5 flex flex-wrap gap-x-3 text-xs font-semibold text-ink-muted">
        {MACROS.map((m) => (
          <span key={m.key} className="inline-flex items-center gap-1">
            <span aria-hidden className={cn("size-2 rounded-full", m.color)} />
            {m.label} {n[m.key]} g
          </span>
        ))}
      </p>
    </div>
  );
}

/** Anneau de progression (objectif quotidien). */
export function TargetRing({
  value,
  target,
  label,
  unit,
  color = "#C6F432",
  size = 96,
}: {
  value: number;
  target: number;
  label: string;
  unit: string;
  color?: string;
  size?: number;
}) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = target > 0 ? Math.min(1, value / target) : 0;
  return (
    <figure className="flex flex-col items-center gap-1.5" aria-label={`${label} : ${Math.round(value)} sur ${target} ${unit}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(20,21,26,0.1)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            style={{ transition: "stroke-dashoffset 600ms ease-out" }}
          />
        </svg>
        <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-extrabold leading-none tabular-nums">{Math.round(value)}</span>
          <span className="text-[0.65rem] font-bold text-ink-muted">
            / {target} {unit}
          </span>
        </div>
      </div>
      <figcaption className="text-xs font-bold">{label}</figcaption>
    </figure>
  );
}
