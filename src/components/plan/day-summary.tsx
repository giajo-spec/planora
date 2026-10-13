import type { PlanDay, Profile } from "@/lib/domain/types";
import { roundNutrition } from "@/lib/nutrition/nutrition";
import { dayMinutes, dayNutritionPerPerson } from "@/lib/planner/plan-stats";
import { ProgressBar } from "@/components/ui/primitives";
import { formatMinutes } from "@/components/recipe/recipe-meta";

/** Résumé nutritionnel d'une journée, pour l'utilisateur principal. */
export function DaySummary({ day, profile }: { day: PlanDay; profile: Profile }) {
  const n = roundNutrition(dayNutritionPerPerson(day, profile.portionFactor));
  const rows = [
    { label: "Calories", value: n.kcal, target: profile.targets.kcal, unit: "kcal", tone: "tomato" as const },
    { label: "Protéines", value: n.protein, target: profile.targets.protein, unit: "g", tone: "violet" as const },
    { label: "Glucides", value: n.carbs, target: profile.targets.carbs, unit: "g", tone: "sky" as const },
    { label: "Lipides", value: n.fat, target: profile.targets.fat, unit: "g", tone: "sun" as const },
  ];
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="font-extrabold">Pour vous ce jour-là*</h3>
        <span className="text-sm font-semibold text-ink-muted">{formatMinutes(dayMinutes(day))} en cuisine</span>
      </div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-1 flex justify-between text-sm font-semibold">
              <span>{r.label}</span>
              <span className="tabular-nums text-ink-muted">
                {r.value} / {r.target} {r.unit}
              </span>
            </div>
            <ProgressBar value={r.value} max={r.target} label={`${r.label} : ${r.value} sur ${r.target} ${r.unit}`} tone={r.tone} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-muted">* 1 portion par repas{profile.portionFactor !== 1 ? ` × ${String(profile.portionFactor).replace(".", ",")}` : ""}. Estimations de démonstration.</p>
    </div>
  );
}
