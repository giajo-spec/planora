import { ChefHat, Flame, ListChecks, ShieldAlert, Utensils } from "lucide-react";
import type { FirstTimeGuide as Guide } from "@/lib/domain/types";

/** Guide « Je n'ai jamais cuisiné ça ». */
export function FirstTimeGuide({ guide }: { guide: Guide }) {
  const sections = [
    { title: "Ustensiles nécessaires", items: guide.utensils, icon: Utensils, tone: "bg-slate-soft" },
    { title: "Préparer les ingrédients", items: guide.prep, icon: ListChecks, tone: "bg-gold-soft" },
    { title: "Techniques de base", items: guide.techniques, icon: ChefHat, tone: "bg-plum-soft" },
    { title: "Reconnaître une cuisson adéquate", items: guide.doneness, icon: Flame, tone: "bg-terra-soft" },
    { title: "Sécurité alimentaire", items: guide.safety, icon: ShieldAlert, tone: "bg-amber-soft" },
  ];
  return (
    <div className="space-y-3">
      {sections.map(({ title, items, icon: Icon, tone }) => (
        <section key={title} className={`rounded-3xl p-4 ${tone}`}>
          <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
            <Icon aria-hidden className="size-5" /> {title}
          </h3>
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li key={item} className="flex gap-2 leading-snug">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="text-sm text-ink-muted">Aucune vidéo n&apos;est fournie : chaque technique est décrite par écrit, étape par étape.</p>
    </div>
  );
}
