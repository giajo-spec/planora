"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { PricingCards } from "./pricing-cards";

const FAQ = [
  { q: "Puis-je changer de formule ?", a: "Oui, à tout moment depuis cette page ou votre profil. Votre menu est adapté aussitôt ; les repas verrouillés sont conservés." },
  { q: "Mes allergies sont-elles respectées dans toutes les formules ?", a: "Toujours. Les allergies déclarées sont des règles strictes : aucune recette qui contient un allergène déclaré n'est proposée, quelle que soit la formule." },
  { q: "Qu'est-ce qui change concrètement avec la formule Famille ?", a: "Le planificateur priorise les recettes pour enfants (douces, simples, sans piquant), prévoit une collation et calcule les portions pour tout le foyer." },
  { q: "Et avec la formule En forme ?", a: "Les recettes riches en protéines et de récupération passent en premier, vos portions sont augmentées et vos objectifs de macros s'affichent partout." },
  { q: "Quand le paiement sera-t-il disponible ?", a: "Le paiement sécurisé (Stripe) arrivera avec les comptes utilisateurs. D'ici là, toutes les formules sont utilisables gratuitement dans ce prototype." },
];

export function PricingView() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="page">
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <p className="eyebrow">Formules PLANORA</p>
        <h1 className="mt-2 text-display-lg">
          Une formule pour <em className="font-light text-gold-deep">chaque table</em>.
        </h1>
        <p className="mt-4 text-lg text-ink-soft">Seul·e, en famille ou à l&apos;entraînement : PLANORA adapte les recettes, les portions et les priorités à votre vie.</p>
      </header>
      <PricingCards />
      <section aria-labelledby="faq" className="mx-auto mt-20 max-w-3xl">
        <h2 id="faq" className="text-center text-display-md">Questions fréquentes</h2>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {FAQ.map((item, i) => (
            <li key={item.q}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left font-display text-lg">
                {item.q}
                <ChevronDown aria-hidden className={`size-5 shrink-0 text-gold-deep transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="animate-slide-up pb-5 text-ink-soft">{item.a}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
