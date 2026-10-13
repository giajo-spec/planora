import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-[7rem] font-semibold leading-none text-gold [-webkit-text-stroke:3px_#14151A]">404</p>
      <h1 className="text-display-md">Cette page n&apos;est pas au menu.</h1>
      <ButtonLink href="/accueil" size="lg">
        Retour au tableau de bord
      </ButtonLink>
    </div>
  );
}
