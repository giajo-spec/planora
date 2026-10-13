import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import LandingPage from "@/app/page";
import NotFound from "@/app/not-found";
import { CookingMode } from "@/components/cooking/cooking-mode";
import { Dashboard } from "@/components/dashboard/dashboard";
import { FitnessView } from "@/components/fitness/fitness-view";
import { GroceryView } from "@/components/grocery/grocery-view";
import { AppShell } from "@/components/layout/app-shell";
import { PlanView } from "@/components/plan/plan-view";
import { ProfileView } from "@/components/profile/profile-view";
import { Questionnaire } from "@/components/questionnaire/questionnaire";
import { RecipeCatalog } from "@/components/recipe/recipe-catalog";
import { RecipeDetail } from "@/components/recipe/recipe-detail";
import { ToastProvider } from "@/components/ui/toast";
import { getRecipe } from "@/lib/data/recipes";
import { AppProvider } from "@/lib/state/app-store";
import { splitRoute, useRoute } from "./shims/router";

/** Point d'entrée de la version HTML autonome (mêmes composants que l'app Next.js). */
const TITLES: Record<string, string> = {
  "/accueil": "Tableau de bord",
  "/plan": "Plan de la semaine",
  "/recettes": "Recettes",
  "/epicerie": "Liste d'épicerie",
  "/profil": "Profil",
  "/en-forme": "En forme",
  "/questionnaire": "Mon profil alimentaire",
};

function resolve(pathname: string): { element: React.ReactNode; title?: string } {
  const shell = (node: React.ReactNode) => <AppShell>{node}</AppShell>;
  switch (pathname) {
    case "/":
      return { element: <LandingPage /> };
    case "/questionnaire":
      return { element: <Questionnaire /> };
    case "/accueil":
      return { element: shell(<Dashboard />) };
    case "/plan":
      return { element: shell(<PlanView />) };
    case "/recettes":
      return { element: shell(<RecipeCatalog />) };
    case "/epicerie":
      return { element: shell(<GroceryView />) };
    case "/profil":
      return { element: shell(<ProfileView />) };
    case "/en-forme":
      return { element: shell(<FitnessView />) };
  }
  const recipe = pathname.match(/^\/recettes\/([\w-]+)$/);
  if (recipe && getRecipe(recipe[1])) return { element: shell(<RecipeDetail recipeId={recipe[1]} />), title: getRecipe(recipe[1])!.name };
  const cook = pathname.match(/^\/cuisine\/([\w-]+)$/);
  if (cook && getRecipe(cook[1])) return { element: <CookingMode recipeId={cook[1]} />, title: `Cuisine guidée — ${getRecipe(cook[1])!.name}` };
  return { element: <NotFound /> };
}

function App() {
  const route = useRoute();
  const { pathname } = splitRoute(route);
  const { element, title } = resolve(pathname);
  const pageTitle = title ?? TITLES[pathname];
  if (typeof document !== "undefined") document.title = pageTitle ? `${pageTitle} · Projet Nutrition` : "Projet Nutrition — vos repas de la semaine, réglés";
  // key = route complète : chaque navigation remonte la page (paramètres ?portions=, ?jour=…).
  return <Suspense key={route}>{element}</Suspense>;
}

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AppProvider>,
);
