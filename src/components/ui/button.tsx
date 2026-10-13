import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "dark" | "secondary" | "ghost" | "tomato" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-bold transition-[transform,box-shadow,background-color] duration-150 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "border-2 border-ink bg-lime text-ink shadow-pop hover:bg-[#d4fb55] active:translate-y-[3px] active:shadow-none",
  tomato: "border-2 border-ink bg-tomato text-ink shadow-pop hover:bg-[#ff6d44] active:translate-y-[3px] active:shadow-none",
  dark: "bg-ink text-paper hover:bg-ink-soft active:scale-[0.98]",
  secondary: "border-2 border-ink bg-surface text-ink hover:bg-paper active:scale-[0.98]",
  ghost: "text-ink hover:bg-ink/[0.06] active:bg-ink/10",
  danger: "bg-danger text-white hover:brightness-110 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "min-h-tap px-4 text-sm",
  md: "min-h-tap px-5 text-[0.95rem]",
  lg: "min-h-14 px-6 text-lg",
  xl: "min-h-16 px-8 text-xl",
};

export interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

export function buttonClass({ variant = "primary", size = "md", block }: ButtonStyleProps, className?: string) {
  return cn(base, variants[variant], sizes[size], block && "w-full", className);
}

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps>(
  function Button({ variant, size, block, className, type = "button", ...props }, ref) {
    return <button ref={ref} type={type} className={buttonClass({ variant, size, block }, className)} {...props} />;
  },
);

export function ButtonLink({
  href,
  variant,
  size,
  block,
  className,
  ...props
}: React.ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link href={href} className={buttonClass({ variant, size, block }, className)} {...props} />;
}

/** Bouton icône carré (≥ 44 px) avec libellé accessible obligatoire. */
export const IconButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: "light" | "dark" | "lime" | "plain" }
>(function IconButton({ label, tone = "light", className, type = "button", children, ...props }, ref) {
  const tones = {
    light: "bg-surface border border-line text-ink hover:border-ink",
    dark: "bg-ink text-paper hover:bg-ink-soft",
    lime: "bg-lime text-ink border-2 border-ink",
    plain: "text-ink hover:bg-ink/[0.06]",
  };
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full transition active:scale-95 disabled:opacity-40",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
