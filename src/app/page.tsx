import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChefHat,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  ShoppingBasket,
  Timer,
} from "lucide-react";
import { DemoButton, ResumeLink } from "@/components/landing/demo-button";
import { Logo } from "@/components/layout/logo";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { ButtonLink } from "@/components/ui/button";
import { getRecipe } from "@/lib/data/recipes";
import { nutritionPerServing, roundNutrition } from "@/lib/nutrition/nutrition";
import { RECIPES, RECIPE_MAP } from "@/lib/data/recipes";
import { buildGroceryLines } from "@/lib/grocery/grocery";

const FEATURES = [
  { icon: CalendarDays, title: "Un plan qui vous ressemble", text: "7 jours de repas générés selon votre foyer, vos goûts, votre temps et votre équipement. Verrouillez ce que vous aimez, remplacez le reste en un geste." },
  { icon: BookOpen, title: "Des recettes du monde", text: "Inde, Maroc, Corée, Mexique, Grèce… des plats testés, avec quantités recalculées automatiquement pour 1 à 24 portions." },
  { icon: ShoppingBasket, title: "L'épicerie, déjà faite", text: "Une liste regroupée par rayon, quantités additionnées, garde-manger pris en compte. Elle se met à jour toute seule quand votre menu change." },
  { icon: HeartPulse, title: "Nutrition sous les yeux", text: "Calories et macros estimées par repas et par jour, comparées à vos objectifs personnels." },
  { icon: ChefHat, title: "Cuisine guidée", text: "Une étape à la fois, en gros caractères, avec minuteries intégrées, conseils de débutant et réponses aux questions fréquentes." },
  { icon: ShieldCheck, title: "Allergies respectées", text: "Vos allergies sont des règles strictes : une recette qui contient un allergène déclaré n'est jamais proposée." },
];

export default function LandingPage() {
  const hero = ["poulet-tikka", "poke-saumon", "shakshuka"].map((id) => getRecipe(id)!);
  const tikka = roundNutrition(nutritionPerServing(hero[0]));
  const cuisines = new Set(RECIPES.map((r) => r.cuisine)).size;
  const heroArticles = buildGroceryLines(hero.map((r) => ({ recipeId: r.id, servings: 4 })), RECIPE_MAP).length;

  return (
    <div className="overflow-x-clip">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo />
        <nav aria-label="Sections" className="hidden items-center gap-6 text-sm font-bold md:flex">
          <a href="#fonctionnalites" className="hover:underline">Fonctionnalités</a>
          <a href="#en-forme" className="hover:underline">En forme</a>
          <a href="#abonnement" className="hover:underline">Abonnement</a>
        </nav>
        <ResumeLink />
      </header>

      {/* Héros */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-12">
        <div className="min-w-0 animate-slide-up">
          <p className="mb-6 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold-deep">
            <span aria-hidden className="h-px w-10 bg-gold" /> L&apos;art de bien manger, planifié
          </p>
          <h1 className="text-display-xl">
            Vos repas de la semaine.{" "}
            <em className="whitespace-nowrap font-light text-gold-deep">Réglés.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-soft sm:text-xl">
            Un menu de 7 jours adapté à votre famille, la liste d&apos;épicerie qui se fait toute seule et un coach de cuisine
            dans votre poche. Moins de charge mentale, plus de bons repas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/questionnaire" size="xl" className="whitespace-nowrap">
              Commencer gratuitement <ArrowRight aria-hidden className="size-5" />
            </ButtonLink>
            <DemoButton variant="secondary" size="xl" className="whitespace-nowrap">
              Découvrir l&apos;application
            </DemoButton>
          </div>
          <p className="mt-4 text-sm text-ink-muted">Sans compte, sans carte de crédit. Vos données restent dans votre navigateur.</p>
        </div>

        {/* Aperçu construit avec les vraies données */}
        <div aria-hidden className="relative mx-auto w-full min-w-0 max-w-md">
          <div className="absolute -left-10 -top-10 size-40 rounded-full border border-gold/60" />
          <div className="absolute -bottom-12 -right-8 size-56 rounded-full border border-gold/40" />
          <div className="relative rounded-[2rem] border border-line bg-surface p-5 shadow-pop-lg">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">Lundi</p>
              <span className="rounded-full border border-gold px-3 py-1 text-xs font-semibold text-gold-deep">3 repas · 1 collation</span>
            </div>
            <div className="space-y-2.5">
              {hero.map((r, i) => (
                <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-paper p-2">
                  <RecipeImage recipe={r} variant="thumb" className="size-14 shrink-0 rounded-xl" />
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-bold uppercase tracking-wider text-ink-muted">{["Souper", "Dîner", "Déjeuner"][i]}</p>
                    <p className="truncate font-bold">{r.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-ink py-2 text-paper">
                <p className="font-display text-lg font-semibold">{tikka.kcal}</p>
                <p className="text-[0.65rem] font-bold uppercase text-paper/70">kcal</p>
              </div>
              <div className="rounded-2xl bg-plum-soft py-2">
                <p className="font-display text-lg font-semibold">{tikka.protein} g</p>
                <p className="text-[0.65rem] font-bold uppercase text-plum-deep">protéines</p>
              </div>
              <div className="rounded-2xl bg-gold-soft py-2">
                <p className="font-display text-lg font-semibold">{heroArticles}</p>
                <p className="text-[0.65rem] font-bold uppercase">articles</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-6 flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper shadow-pop">
            <Timer className="size-4 text-gold-light" /> Riz basmati · 11:42
          </div>
        </div>
      </section>

      {/* Bandeau */}
      <section className="bg-ink text-gold-light">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-5 text-center font-display text-lg italic">
          <span>{RECIPES.length} recettes testées</span>
          <span aria-hidden className="text-gold">✦</span>
          <span>{cuisines} cuisines du monde</span>
          <span aria-hidden className="text-gold">✦</span>
          <span>Épicerie automatique</span>
          <span aria-hidden className="text-gold">✦</span>
          <span>Minuteries intégrées</span>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-20 sm:px-6">
        <p className="eyebrow">Tout ce qu&apos;il faut</p>
        <h2 className="mt-2 max-w-2xl text-display-lg">De « on mange quoi ce soir ? » à « c&apos;est prêt ! »</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="card p-6">
              <div className="mb-5 flex size-12 items-center justify-center rounded-full border border-gold/70 text-gold-deep">
                <Icon aria-hidden className="size-6" />
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-ink-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-display-lg">Prêt en 3 étapes</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["Répondez à 10 questions", "Foyer, goûts, allergies, temps, équipement et objectifs. Environ 2 minutes."],
              ["Recevez votre semaine", "Un menu équilibré et varié, que vous ajustez : remplacer, verrouiller, déplacer, portions."],
              ["Faites l'épicerie et cuisinez", "La liste est prête par rayon. En cuisine, l'app vous guide étape par étape."],
            ].map(([title, text], i) => (
              <li key={title} className="relative rounded-card border border-line bg-paper p-7">
                <span className="font-display text-6xl font-light italic text-gold-deep">{["I", "II", "III"][i]}</span>
                <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-ink-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* En forme */}
      <section id="en-forme" className="scroll-mt-6 bg-ink py-20 text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-gold">
              <Dumbbell aria-hidden className="size-4" /> Section « En forme »
            </p>
            <h2 className="mt-3 text-display-lg">Vous vous entraînez ? Votre assiette aussi.</h2>
            <p className="mt-5 text-lg text-paper/80">
              Salle de sport, course, vélo : fixez vos objectifs de calories et de protéines, ajustez vos portions et trouvez
              quoi manger avant et après l&apos;effort.
            </p>
            <ul className="mt-6 space-y-3">
              {["Repas riches en protéines mis en avant", "Objectifs de macros personnalisables", "Idées pré et post-entraînement", "Portions adaptées à vos besoins"].map((t) => (
                <li key={t} className="flex items-center gap-3 font-semibold">
                  <span className="flex size-7 items-center justify-center rounded-full border border-gold text-gold-light">
                    <Check aria-hidden className="size-4" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["souvlaki-poulet", "bol-burrito-poulet", "smoothie-proteine-banane", "saumon-teriyaki"].map((id) => {
              const r = getRecipe(id)!;
              const n = roundNutrition(nutritionPerServing(r));
              return (
                <div key={id} className="overflow-hidden rounded-3xl bg-paper text-ink">
                  <RecipeImage recipe={r} className="aspect-[4/3]" />
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-bold leading-tight">{r.name}</p>
                    <p className="mt-1 text-xs font-bold text-plum-deep">{n.protein} g protéines*</p>
                  </div>
                </div>
              );
            })}
            <p className="col-span-2 text-xs text-paper/70">* Estimations de démonstration, par portion.</p>
          </div>
        </div>
      </section>

      {/* Abonnement */}
      <section id="abonnement" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-20 sm:px-6">
        <h2 className="text-display-lg">Simple et transparent</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-card border border-gold/70 bg-surface p-7 shadow-pop-lg">
            <p className="eyebrow">Disponible aujourd&apos;hui</p>
            <h3 className="mt-1 text-3xl font-semibold">Gratuit</h3>
            <ul className="mt-5 space-y-2.5">
              {["Questionnaire et plan de 7 jours", "Catalogue de recettes et filtres", "Liste d'épicerie intelligente", "Cuisine guidée avec minuteries", "Section « En forme »"].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-sage-deep" /> {t}
                </li>
              ))}
            </ul>
            <ButtonLink href="/questionnaire" size="lg" block className="mt-7">
              Commencer gratuitement
            </ButtonLink>
          </div>
          <div className="rounded-card bg-plum p-7 text-paper">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-paper/80">En préparation</p>
            <h3 className="mt-1 text-3xl font-semibold">Premium</h3>
            <p className="mt-2 text-paper/85">L&apos;abonnement n&apos;est pas encore offert. Ce qui est prévu :</p>
            <ul className="mt-5 space-y-2.5">
              {["Compte et synchronisation entre appareils", "Personnalisation par IA et historique", "Prix des épiceries près de chez vous", "Application mobile installable"].map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-gold" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-4 py-10 text-center text-sm text-ink-muted">
        <p className="font-bold text-ink">PLANORA</p>
        <p className="mx-auto mt-2 max-w-2xl">
          Les valeurs nutritionnelles affichées sont des estimations de démonstration et ne remplacent pas l&apos;avis d&apos;un
          professionnel de la santé. Vérifiez toujours les étiquettes en cas d&apos;allergie.
        </p>
      </footer>
    </div>
  );
}
