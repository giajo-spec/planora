import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "gold" | "dark" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold tracking-[0.01em] transition-[transform,box-shadow,background-color,color] duration-200 disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper shadow-pop hover:bg-ink-soft active:scale-[0.985]",
  gold: "bg-gold text-ink shadow-gold hover:bg-gold-light active:scale-[0.985]",
  dark: "bg-ink-soft text-paper hover:bg-ink active:scale-[0.985]",
  secondary: "border border-ink/80 bg-transparent text-ink hover:bg-ink hover:text-paper active:scale-[0.985]",
  ghost: "text-ink hover:bg-ink/[0.05] active:bg-ink/10",
  danger: "bg-danger text-white hover:brightness-110 active:scale-[0.985]",
};

const sizes: Record<Size, string> = {
  sm: "min-h-tap px-5 text-sm",
  md: "min-h-tap px-6 text-[0.95rem]",
  lg: "min-h-14 px-7 text-base",
  xl: "min-h-16 px-9 text-lg",
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
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: "light" | "dark" | "gold" | "plain" }
>(function IconButton({ label, tone = "light", className, type = "button", children, ...props }, ref) {
  const tones = {
    light: "bg-surface border border-line text-ink hover:border-gold",
    dark: "bg-ink text-paper hover:bg-ink-soft",
    gold: "bg-gold text-ink",
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
