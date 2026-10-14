"use client";

import { Check, Clock, Dumbbell, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { SubscriptionPlan } from "@/lib/domain/types";
import { useApp } from "@/lib/state/app-store";
import { PLAN_OFFERS, formatPrice, yearlyPrice } from "@/lib/subscriptions";
import { cn } from "@/lib/utils/cn";

const ICONS: Record<SubscriptionPlan, typeof User> = { personnalise: User, famille: Users, "en-forme": Dumbbell };

/** Les 3 formules PLANORA. Aucun paiement : choisir une formule personnalise l'application. */
export function PricingCards({ compact }: { compact?: boolean }) {
  const { hydrated, profile, chooseSubscription } = useApp();
  const router = useRouter();
  const { notify } = useToast();
  const [yearly, setYearly] = useState(false);

  const choose = (key: SubscriptionPlan) => {
    if (profile && !profile.isDemo) {
      chooseSubscription(key);
      notify(`Formule ${PLAN_OFFERS.find((p) => p.key === key)!.name} activée — menu adapté`);
      router.push("/accueil");
    } else {
      router.push(`/questionnaire?forfait=${key}`);
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div role="radiogroup" aria-label="Facturation" className="inline-flex rounded-full border border-line bg-surface p-1">
          {[
            [false, "Mensuel"],
            [true, "Annuel · 2 mois offerts"],
          ].map(([value, label]) => (
            <button
              key={String(value)}
              type="button"
              role="radio"
              aria-checked={yearly === value}
              onClick={() => setYearly(value as boolean)}
              className={cn("min-h-tap rounded-full px-5 text-sm font-semibold transition", yearly === value ? "bg-ink text-paper" : "text-ink-soft hover:text-ink")}
            >
              {label as string}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-stretch gap-5 lg:grid-cols-3">
        {PLAN_OFFERS.map((offer) => {
          const Icon = ICONS[offer.key];
          const current = hydrated && profile?.subscription === offer.key && !profile.isDemo;
          const dark = offer.highlight;
          return (
            <article
              key={offer.key}
              className={cn(
                "relative flex flex-col rounded-[2rem] p-7 transition",
                dark ? "bg-ink text-paper shadow-pop-lg lg:-my-4 lg:py-11" : "border border-line bg-surface shadow-card",
              )}
            >
              {dark && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ink">
                  La plus choisie
                </span>
              )}
              <div className={cn("mb-5 flex size-12 items-center justify-center rounded-full border", dark ? "border-gold text-gold-light" : "border-gold/70 text-gold-deep")}>
                <Icon aria-hidden className="size-5" />
              </div>
              <h3 className="font-display text-3xl">{offer.name}</h3>
              <p className={cn("mt-1 text-sm", dark ? "text-paper/70" : "text-ink-muted")}>{offer.audience}</p>
              <p className={cn("mt-4 font-display text-lg italic", dark ? "text-gold-light" : "text-gold-deep")}>{offer.tagline}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl">{formatPrice(yearly ? yearlyPrice(offer) : offer.monthly).replace(/\s?\$/, "")}</span>
                <span className={cn("text-sm", dark ? "text-paper/70" : "text-ink-muted")}>$ / {yearly ? "an" : "mois"}</span>
              </p>
              {!compact && (
                <ul className="mt-6 flex-1 space-y-3 text-[0.95rem]">
                  {offer.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", dark ? "text-gold-light" : "text-gold-deep")} />
                      {f}
                    </li>
                  ))}
                  {offer.soon.map((f) => (
                    <li key={f} className={cn("flex gap-3", dark ? "text-paper/55" : "text-ink-muted")}>
                      <Clock aria-hidden className="mt-0.5 size-4 shrink-0" />
                      <span>
                        {f} <span className="text-xs uppercase tracking-wider">(bientôt)</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Button variant={dark ? "gold" : "primary"} size="lg" block className="mt-8" disabled={!hydrated || current} onClick={() => choose(offer.key)}>
                {current ? "Votre formule actuelle" : profile && !profile.isDemo ? `Passer à ${offer.name}` : `Choisir ${offer.name}`}
              </Button>
            </article>
          );
        })}
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-muted">
        Tarifs indicatifs en dollars canadiens, taxes en sus. Le paiement n&apos;est pas encore activé : choisir une formule
        personnalise dès maintenant votre menu, sans frais ni carte de crédit.
      </p>
    </div>
  );
}
