import { INGREDIENTS } from "@/lib/data/ingredients";
import { ingredientColor } from "@/lib/data/ingredient-colors";
import type { Illustration, Recipe } from "@/lib/domain/types";
import { toGrams } from "@/lib/nutrition/units";
import { createRng } from "@/lib/planner/random";

/**
 * Illustration vectorielle générée pour chaque recette, à partir de ses
 * VRAIS ingrédients (couleurs, proportions). Aucune image externe : rendu
 * net à toutes les tailles, poids nul, cohérent avec la direction artistique.
 */

const SIGNATURE_STYLE: Record<string, Illustration> = {
  shakshuka: "assiette",
  "bol-yogourt-grec": "bol",
  "bircher-muesli": "bol",
  "huevos-rancheros": "assiette",
  "tofu-brouille-epice": "assiette",
  "poulet-tikka": "bol",
  "dal-lentilles-corail": "soupe",
  "tajine-poulet": "soupe",
  "bol-burrito-poulet": "bol",
  "souvlaki-poulet": "assiette",
  "bol-falafels": "bol",
  minestrone: "soupe",
  "risotto-champignons": "bol",
  "poke-saumon": "bol",
  "saumon-teriyaki": "assiette",
  "boeuf-brocoli": "assiette",
  "pad-thai-crevettes": "pates",
  "bibimbap-tofu": "bol",
  "houmous-crudites": "pot",
  "edamames-ail-piment": "pot",
  "boules-energie-dattes": "pot",
  "smoothie-proteine-banane": "verre",
};

export function illustrationOf(recipe: Pick<Recipe, "id" | "illustration">): Illustration {
  return recipe.illustration ?? SIGNATURE_STYLE[recipe.id] ?? "assiette";
}

const BACKGROUND: Record<string, string> = {
  Indienne: "#F7ECD2", "Moyen-orientale": "#F4E2D7", Méditerranéenne: "#E2E9EF", Suisse: "#ECE4D5", Mexicaine: "#E4EBDE",
  Marocaine: "#F4E2D7", Grecque: "#E2E9EF", Libanaise: "#E4EBDE", Italienne: "#F4E2D7", Hawaïenne: "#EEE3EC", Japonaise: "#ECE4D5",
  Chinoise: "#F2E8D5", Thaïlandaise: "#E4EBDE", Coréenne: "#EEE3EC", "Nord-américaine": "#F2E8D5", Québécoise: "#F2E8D5", Française: "#E2E9EF",
  Argentine: "#E4EBDE", Indonésienne: "#F4E2D7",
};

const MINOR = /^(sel|poivre|huile|vinaigre|fecule|cassonade|bicarbonate|origan|cumin|curcuma|paprika|garam|cannelle|herbes|piment|assaisonnement|coriandre-moulue|curry|ail|gingembre|sauce-|sirop|miel|moutarde|bouillon)/;
const STARCH = /^(riz|quinoa|couscous|nouilles|pates|penne|spaghetti|pain|tortilla|flocons|pomme-de-terre)/;
const GREEN = /^(coriandre|persil|basilic|menthe|oignon-vert|roquette)/;
const SAUCE = /^(sauce-soja|gochujang|tahini|beurre-arachide|yogourt|pesto|passata|tomates|lait-coco|salsa|sirop|miel|moutarde|bouillon|lait|boisson)/;

interface Palette {
  base: string;
  main: string[];
  green: string;
  sauce: string;
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function paletteOf(recipe: Recipe): Palette {
  const weighted = recipe.ingredients
    .map((line) => {
      const ingredient = INGREDIENTS[line.ingredientId];
      if (!ingredient) return null;
      return { id: line.ingredientId, grams: toGrams(line, ingredient) ?? 50, color: ingredientColor(line.ingredientId, ingredient.aisle) };
    })
    .filter((x): x is { id: string; grams: number; color: string } => x != null);

  const starch = weighted.find((w) => STARCH.test(w.id));
  const main = weighted
    .filter((w) => !MINOR.test(w.id) && !STARCH.test(w.id) && !GREEN.test(w.id))
    .sort((a, b) => b.grams - a.grams)
    .map((w) => w.color)
    .filter((c, i, all) => all.indexOf(c) === i)
    .slice(0, 5);
  const green = weighted.find((w) => GREEN.test(w.id))?.color ?? "#5C8A45";
  const sauce = weighted.find((w) => SAUCE.test(w.id))?.color ?? "#C6A46C";
  return { base: starch?.color ?? "#F3EBDD", main: main.length ? main : ["#C6A46C", "#7FA35B"], green, sauce };
}

/** Assombrit/éclaircit une couleur hexadécimale. */
function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + amount * 255)));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function Shadow({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx + 6} cy={cy + 10} r={r + 6} fill="#16140F" opacity={0.05} />
      <circle cx={cx + 4} cy={cy + 7} r={r + 2} fill="#16140F" opacity={0.07} />
    </>
  );
}

function pieces(rng: () => number, n: number, cx: number, cy: number, rMin: number, rMax: number, a0 = 0, a1 = Math.PI * 2) {
  return Array.from({ length: n }, () => {
    const a = a0 + rng() * (a1 - a0);
    const r = rMin + Math.sqrt(rng()) * (rMax - rMin);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, s: 0.6 + rng() * 0.8, rot: rng() * 180 };
  });
}

function Sprinkles({ rng, color, cx, cy, r, n = 26 }: { rng: () => number; color: string; cx: number; cy: number; r: number; n?: number }) {
  return (
    <>
      {pieces(rng, n, cx, cy, 0, r).map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y} rx={2.6 * p.s} ry={1.4 * p.s} transform={`rotate(${p.rot} ${p.x} ${p.y})`} fill={color} opacity={0.9} />
      ))}
    </>
  );
}

function Bowl({ p, rng, liquid }: { p: Palette; rng: () => number; liquid?: boolean }) {
  const cx = 200, cy = 150, R = 112, r = 94;
  const n = Math.min(4, Math.max(2, p.main.length));
  return (
    <g>
      <Shadow cx={cx} cy={cy} r={R} />
      <circle cx={cx} cy={cy} r={R} fill="#FFFDF8" />
      <circle cx={cx} cy={cy} r={R - 3} fill="none" stroke="#C6A46C" strokeWidth={1.2} opacity={0.8} />
      <circle cx={cx} cy={cy} r={r} fill={liquid ? p.sauce : p.base} />
      {liquid ? (
        <>
          <circle cx={cx} cy={cy} r={r} fill={shade(p.sauce, -0.06)} opacity={0.35} />
          {pieces(rng, 22, cx, cy, 10, r - 14).map((q, i) => (
            <circle key={i} cx={q.x} cy={q.y} r={6 * q.s} fill={p.main[i % p.main.length]} stroke={shade(p.main[i % p.main.length], -0.12)} strokeWidth={0.8} />
          ))}
          <path d={`M ${cx - 40} ${cy - 10} q 25 -30 50 0 t 50 0`} fill="none" stroke="#FBF8F1" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
        </>
      ) : (
        Array.from({ length: n }, (_, i) => {
          const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
          const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
          const color = p.main[i % p.main.length];
          const large = a1 - a0 > Math.PI ? 1 : 0;
          const inner = 26;
          const d = `M ${cx + Math.cos(a0) * inner} ${cy + Math.sin(a0) * inner} L ${cx + Math.cos(a0) * r} ${cy + Math.sin(a0) * r} A ${r} ${r} 0 ${large} 1 ${cx + Math.cos(a1) * r} ${cy + Math.sin(a1) * r} L ${cx + Math.cos(a1) * inner} ${cy + Math.sin(a1) * inner} Z`;
          return (
            <g key={i}>
              <path d={d} fill={color} opacity={0.92} />
              {pieces(rng, 9, cx, cy, inner + 10, r - 10, a0 + 0.12, a1 - 0.12).map((q, j) => (
                <rect key={j} x={q.x - 6 * q.s} y={q.y - 4 * q.s} width={12 * q.s} height={8 * q.s} rx={3.5 * q.s} transform={`rotate(${q.rot} ${q.x} ${q.y})`} fill={shade(color, j % 2 ? -0.08 : 0.06)} />
              ))}
            </g>
          );
        })
      )}
      {!liquid && <circle cx={cx} cy={cy} r={24} fill={p.base} stroke={shade(p.base, -0.08)} strokeWidth={1} />}
      {!liquid && <path d={`M ${cx - 60} ${cy + 30} c 20 -18 40 18 60 0 s 40 18 60 0`} fill="none" stroke={p.sauce} strokeWidth={3.2} strokeLinecap="round" opacity={0.85} />}
      <Sprinkles rng={rng} color={p.green} cx={cx} cy={cy} r={r - 8} n={18} />
    </g>
  );
}

function Plate({ p, rng, pasta }: { p: Palette; rng: () => number; pasta?: boolean }) {
  const cx = 200, cy = 150, R = 118;
  return (
    <g>
      <Shadow cx={cx} cy={cy} r={R} />
      <circle cx={cx} cy={cy} r={R} fill="#FFFDF8" />
      <circle cx={cx} cy={cy} r={R - 20} fill="none" stroke="#E4DACA" strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={R - 4} fill="none" stroke="#C6A46C" strokeWidth={1} opacity={0.7} />
      {pasta ? (
        <>
          <circle cx={cx} cy={cy} r={70} fill={p.sauce} opacity={0.9} />
          {Array.from({ length: 16 }, (_, i) => {
            const a = rng() * Math.PI * 2;
            const r0 = 10 + rng() * 45;
            const x = cx + Math.cos(a) * r0, y = cy + Math.sin(a) * r0;
            return <path key={i} d={`M ${x - 22} ${y} q 11 ${-16 - rng() * 10} 22 0 t 22 0`} fill="none" stroke={i % 3 ? p.base === "#F3EBDD" ? "#E9C77B" : p.base : shade(p.base, -0.08)} strokeWidth={6.5} strokeLinecap="round" transform={`rotate(${rng() * 180} ${x} ${y})`} />;
          })}
          {pieces(rng, 12, cx, cy, 10, 62).map((q, i) => (
            <circle key={i} cx={q.x} cy={q.y} r={5.5 * q.s} fill={p.main[i % p.main.length]} />
          ))}
        </>
      ) : (
        <>
          <ellipse cx={cx - 30} cy={cy + 8} rx={52} ry={40} fill={p.base} />
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx={cx + 22 + i * 9} cy={cy - 30 + i * 22} rx={34} ry={17} transform={`rotate(${-25 + i * 12} ${cx + 22 + i * 9} ${cy - 30 + i * 22})`} fill={shade(p.main[0], i === 1 ? -0.06 : 0)} stroke={shade(p.main[0], -0.15)} strokeWidth={1} />
          ))}
          {pieces(rng, 16, cx - 25, cy + 40, 0, 40).map((q, i) => (
            <circle key={i} cx={q.x} cy={q.y} r={7 * q.s} fill={p.main[1 + (i % Math.max(1, p.main.length - 1))] ?? p.main[0]} />
          ))}
          <path d={`M ${cx + 5} ${cy - 55} c 15 10 30 -5 45 8`} fill="none" stroke={p.sauce} strokeWidth={4} strokeLinecap="round" opacity={0.8} />
        </>
      )}
      <Sprinkles rng={rng} color={p.green} cx={cx} cy={cy} r={80} n={14} />
    </g>
  );
}

function Glass({ p, rng, id }: { p: Palette; rng: () => number; id: string }) {
  const layers = p.main.slice(0, 3);
  const clip = `glass-${id}`;
  return (
    <g>
      <ellipse cx={205} cy={262} rx={70} ry={10} fill="#16140F" opacity={0.08} />
      <defs>
        <clipPath id={clip}>
          <path d="M 145 60 L 255 60 L 240 250 Q 238 262 226 262 L 174 262 Q 162 262 160 250 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x={140} y={60} width={120} height={210} fill={layers[0] ?? p.sauce} />
        {layers.slice(1).map((c, i) => (
          <path key={i} d={`M 140 ${150 + i * 50} q 30 -12 60 0 t 60 0 V 270 H 140 Z`} fill={c} opacity={0.95} />
        ))}
        {pieces(rng, 10, 200, 120, 0, 40).map((q, i) => (
          <circle key={i} cx={q.x} cy={q.y} r={2.2 * q.s} fill="#FFFDF8" opacity={0.5} />
        ))}
      </g>
      <path d="M 145 60 L 255 60 L 240 250 Q 238 262 226 262 L 174 262 Q 162 262 160 250 Z" fill="none" stroke="#C6A46C" strokeWidth={2} />
      <rect x={218} y={20} width={8} height={90} rx={4} transform="rotate(14 222 65)" fill="#16140F" />
      <circle cx={150} cy={64} r={22} fill={p.main[0]} stroke="#FFFDF8" strokeWidth={3} />
    </g>
  );
}

function Wraps({ p, rng }: { p: Palette; rng: () => number }) {
  const shell = p.base;
  return (
    <g>
      {[0, 1].map((i) => {
        const x = 130 + i * 140, y = 165;
        return (
          <g key={i} transform={`rotate(${i ? 8 : -8} ${x} ${y})`}>
            <ellipse cx={x + 6} cy={y + 46} rx={78} ry={10} fill="#16140F" opacity={0.08} />
            {pieces(rng, 14, x, y - 8, 30, 62, Math.PI * 1.05, Math.PI * 1.95).map((q, j) => (
              <circle key={j} cx={q.x} cy={q.y} r={9 * q.s} fill={p.main[j % p.main.length]} />
            ))}
            {pieces(rng, 6, x, y - 6, 40, 60, Math.PI * 1.1, Math.PI * 1.9).map((q, j) => (
              <ellipse key={`g${j}`} cx={q.x} cy={q.y} rx={6} ry={3} fill={p.green} transform={`rotate(${q.rot} ${q.x} ${q.y})`} />
            ))}
            <path d={`M ${x - 75} ${y} A 75 75 0 0 0 ${x + 75} ${y} Z`} fill={shell} stroke={shade(shell, -0.12)} strokeWidth={1.5} />
            <path d={`M ${x - 60} ${y + 8} A 60 60 0 0 0 ${x + 60} ${y + 8}`} fill="none" stroke={shade(shell, -0.08)} strokeWidth={1} strokeDasharray="2 6" />
          </g>
        );
      })}
    </g>
  );
}

function SheetPan({ p, rng }: { p: Palette; rng: () => number }) {
  return (
    <g>
      <rect x={58} y={58} width={292} height={196} rx={22} fill="#16140F" opacity={0.08} />
      <rect x={50} y={50} width={292} height={196} rx={22} fill="#2C2820" />
      <rect x={64} y={64} width={264} height={168} rx={14} fill="#F4EBDA" />
      {pieces(rng, 34, 196, 148, 0, 110).map((q, i) => {
        const c = p.main[i % p.main.length];
        const x = Math.min(310, Math.max(82, q.x)), y = Math.min(214, Math.max(82, 148 + (q.y - 148) * 0.6));
        return <rect key={i} x={x - 11 * q.s} y={y - 8 * q.s} width={22 * q.s} height={16 * q.s} rx={7 * q.s} transform={`rotate(${q.rot} ${x} ${y})`} fill={c} stroke={shade(c, -0.15)} strokeWidth={0.8} />;
      })}
      <Sprinkles rng={rng} color={p.green} cx={196} cy={148} r={90} n={20} />
    </g>
  );
}

function Toasts({ p, rng }: { p: Palette; rng: () => number }) {
  return (
    <g>
      {[0, 1].map((i) => {
        const x = 95 + i * 120, y = 70 + i * 18;
        return (
          <g key={i} transform={`rotate(${i ? 7 : -6} ${x + 70} ${y + 80})`}>
            <rect x={x + 6} y={y + 10} width={140} height={160} rx={26} fill="#16140F" opacity={0.08} />
            <path d={`M ${x} ${y + 40} q 0 -40 40 -40 h 60 q 40 0 40 40 v 110 q 0 10 -10 10 h -120 q -10 0 -10 -10 Z`} fill="#B98249" />
            <path d={`M ${x + 10} ${y + 44} q 0 -32 32 -32 h 56 q 32 0 32 32 v 98 q 0 6 -6 6 h -108 q -6 0 -6 -6 Z`} fill={p.main[0]} />
            {pieces(rng, 12, x + 70, y + 90, 0, 45).map((q, j) => (
              <circle key={j} cx={q.x} cy={q.y} r={7 * q.s} fill={p.main[(j % Math.max(1, p.main.length - 1)) + 1] ?? p.main[0]} />
            ))}
          </g>
        );
      })}
      <Sprinkles rng={rng} color={p.green} cx={200} cy={160} r={90} n={12} />
    </g>
  );
}

function Pot({ p, rng }: { p: Palette; rng: () => number }) {
  const cx = 200, cy = 158;
  return (
    <g>
      <Shadow cx={cx} cy={cy} r={95} />
      <circle cx={cx} cy={cy} r={95} fill="#2C2820" />
      <circle cx={cx} cy={cy} r={88} fill="none" stroke="#C6A46C" strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={80} fill={p.sauce} opacity={0.35} />
      {pieces(rng, 14, cx, cy, 0, 58).map((q, i) => {
        const c = p.main[i % p.main.length];
        return (
          <g key={i}>
            <circle cx={q.x} cy={q.y} r={14 * q.s + 4} fill={c} />
            <circle cx={q.x - 4} cy={q.y - 4} r={(14 * q.s + 4) / 3} fill="#FFFDF8" opacity={0.25} />
          </g>
        );
      })}
    </g>
  );
}

function Cocotte({ p, rng }: { p: Palette; rng: () => number }) {
  const cx = 200, cy = 152, R = 108;
  return (
    <g>
      <Shadow cx={cx} cy={cy} r={R} />
      <rect x={cx - R - 34} y={cy - 14} width={44} height={28} rx={14} fill="#2C2820" />
      <rect x={cx + R - 10} y={cy - 14} width={44} height={28} rx={14} fill="#2C2820" />
      <circle cx={cx} cy={cy} r={R} fill="#2C2820" />
      <circle cx={cx} cy={cy} r={R - 6} fill="none" stroke="#C6A46C" strokeWidth={1.2} opacity={0.8} />
      <circle cx={cx} cy={cy} r={R - 14} fill={p.sauce} />
      <circle cx={cx} cy={cy} r={R - 14} fill={shade(p.sauce, -0.1)} opacity={0.25} />
      {pieces(rng, 26, cx, cy, 8, R - 28).map((q, i) => {
        const c = p.main[i % p.main.length];
        return <rect key={i} x={q.x - 9 * q.s} y={q.y - 7 * q.s} width={18 * q.s} height={14 * q.s} rx={6 * q.s} transform={`rotate(${q.rot} ${q.x} ${q.y})`} fill={c} stroke={shade(c, -0.15)} strokeWidth={0.8} />;
      })}
      <Sprinkles rng={rng} color={p.green} cx={cx} cy={cy} r={R - 30} n={22} />
    </g>
  );
}

function Burger({ p, rng }: { p: Palette; rng: () => number }) {
  const x = 200;
  const meat = p.main[0];
  return (
    <g>
      <ellipse cx={x + 6} cy={262} rx={120} ry={12} fill="#16140F" opacity={0.08} />
      <rect x={x - 110} y={222} width={220} height={30} rx={14} fill="#D9A15A" />
      <path d={`M ${x - 112} 214 q 28 -16 56 0 t 56 0 t 56 0 t 56 0 v 10 h -224 Z`} fill={p.green} />
      <rect x={x - 104} y={176} width={208} height={40} rx={18} fill={meat} stroke={shade(meat, -0.18)} strokeWidth={1.5} />
      <path d={`M ${x - 100} 176 L ${x + 100} 176 L ${x + 70} 196 L ${x + 40} 178 L ${x} 198 L ${x - 40} 178 L ${x - 80} 196 Z`} fill={p.main[1] ?? "#F0A93B"} opacity={0.95} />
      <rect x={x - 96} y={160} width={192} height={16} rx={8} fill={p.main[2] ?? "#D9483B"} />
      <path d={`M ${x - 112} 160 Q ${x - 110} 70 ${x} 66 Q ${x + 110} 70 ${x + 112} 160 Z`} fill="#D9A15A" />
      <path d={`M ${x - 112} 160 Q ${x - 110} 70 ${x} 66 Q ${x + 110} 70 ${x + 112} 160`} fill="none" stroke={shade("#D9A15A", -0.15)} strokeWidth={1.5} />
      {pieces(rng, 18, x, 108, 10, 70, Math.PI * 1.05, Math.PI * 1.95).map((q, i) => (
        <ellipse key={i} cx={q.x} cy={q.y + 30} rx={3.2} ry={1.8} transform={`rotate(${q.rot} ${q.x} ${q.y + 30})`} fill="#FBF3E0" />
      ))}
    </g>
  );
}

function Skewers({ p, rng }: { p: Palette; rng: () => number }) {
  const cx = 200, cy = 150;
  return (
    <g>
      <Shadow cx={cx} cy={cy} r={118} />
      <circle cx={cx} cy={cy} r={118} fill="#FFFDF8" />
      <circle cx={cx} cy={cy} r={114} fill="none" stroke="#C6A46C" strokeWidth={1} opacity={0.7} />
      {[-38, 0, 38].map((dy, k) => (
        <g key={k} transform={`rotate(-14 ${cx} ${cy + dy})`}>
          <line x1={cx - 115} y1={cy + dy} x2={cx + 115} y2={cy + dy} stroke="#B98249" strokeWidth={4} strokeLinecap="round" />
          {Array.from({ length: 6 }, (_, i) => {
            const c = i % 2 ? p.main[(k + 1) % p.main.length] ?? p.main[0] : p.main[0];
            const px = cx - 80 + i * 32;
            return <rect key={i} x={px - 13} y={cy + dy - 13 + rng() * 2} width={26} height={26} rx={8} fill={c} stroke={shade(c, -0.15)} strokeWidth={1} />;
          })}
        </g>
      ))}
      <Sprinkles rng={rng} color={p.green} cx={cx} cy={cy} r={90} n={14} />
    </g>
  );
}

function Papillote({ p, rng }: { p: Palette; rng: () => number }) {
  const cx = 200, cy = 158;
  return (
    <g>
      <ellipse cx={cx + 8} cy={cy + 16} rx={140} ry={92} fill="#16140F" opacity={0.08} />
      <path d={`M ${cx - 150} ${cy} Q ${cx - 130} ${cy - 95} ${cx} ${cy - 100} Q ${cx + 130} ${cy - 95} ${cx + 150} ${cy} Q ${cx + 130} ${cy + 95} ${cx} ${cy + 100} Q ${cx - 130} ${cy + 95} ${cx - 150} ${cy} Z`} fill="#F4EBDA" stroke="#D9C9A8" strokeWidth={2} />
      <path d={`M ${cx - 140} ${cy} Q ${cx} ${cy - 20} ${cx + 140} ${cy}`} fill="none" stroke="#D9C9A8" strokeWidth={1.5} strokeDasharray="3 5" />
      {pieces(rng, 12, cx, cy, 30, 70).map((q, i) => (
        <ellipse key={i} cx={q.x} cy={q.y} rx={12 * q.s} ry={6 * q.s} transform={`rotate(${q.rot} ${q.x} ${q.y})`} fill={p.main[(i % Math.max(1, p.main.length - 1)) + 1] ?? p.main[0]} />
      ))}
      <ellipse cx={cx} cy={cy} rx={62} ry={30} fill={p.main[0]} stroke={shade(p.main[0], -0.15)} strokeWidth={1.2} />
      <path d={`M ${cx - 40} ${cy - 8} q 20 10 40 0 t 40 0`} fill="none" stroke={shade(p.main[0], -0.12)} strokeWidth={2} opacity={0.7} />
      <circle cx={cx + 30} cy={cy - 18} r={11} fill="#F3DB5A" stroke="#FFFDF8" strokeWidth={2} />
      <Sprinkles rng={rng} color={p.green} cx={cx} cy={cy} r={60} n={12} />
    </g>
  );
}

function Gratin({ p, rng }: { p: Palette; rng: () => number }) {
  return (
    <g>
      <rect x={56} y={66} width={300} height={190} rx={34} fill="#16140F" opacity={0.08} />
      <rect x={48} y={56} width={304} height={190} rx={34} fill="#FFFDF8" stroke="#C6A46C" strokeWidth={1.5} />
      <rect x={66} y={74} width={268} height={154} rx={22} fill="#EDC27A" />
      {pieces(rng, 30, 200, 151, 0, 120).map((q, i) => {
        const x = Math.min(318, Math.max(82, q.x)), y = Math.min(214, Math.max(88, 151 + (q.y - 151) * 0.55));
        return <ellipse key={i} cx={x} cy={y} rx={9 * q.s} ry={6 * q.s} fill={i % 3 ? "#C9853E" : p.sauce} opacity={i % 3 ? 0.55 : 0.8} />;
      })}
      {pieces(rng, 10, 200, 151, 0, 100).map((q, i) => (
        <circle key={`v${i}`} cx={Math.min(318, Math.max(82, q.x))} cy={Math.min(214, Math.max(88, 151 + (q.y - 151) * 0.55))} r={5} fill={p.main[i % p.main.length]} />
      ))}
      <Sprinkles rng={rng} color={p.green} cx={200} cy={151} r={80} n={10} />
    </g>
  );
}

export function illustrationBackground(recipe: Pick<Recipe, "cuisine">): string {
  return BACKGROUND[recipe.cuisine] ?? "#F2E8D5";
}

export function FoodIllustration({ recipe, className, fit = "slice" }: { recipe: Recipe; className?: string; fit?: "slice" | "meet" }) {
  const style = illustrationOf(recipe);
  const p = paletteOf(recipe);
  const rng = createRng(hash(recipe.id));
  const safeId = recipe.id.replace(/[^a-z0-9-]/gi, "");
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio={`xMidYMid ${fit}`} className={className} aria-hidden focusable="false">
      <rect width="400" height="300" fill={BACKGROUND[recipe.cuisine] ?? "#F2E8D5"} />
      <circle cx={360} cy={-20} r={120} fill="none" stroke="#C6A46C" strokeWidth={1} opacity={0.45} />
      <circle cx={-30} cy={320} r={110} fill="none" stroke="#C6A46C" strokeWidth={1} opacity={0.35} />
      {style === "bol" && <Bowl p={p} rng={rng} />}
      {style === "soupe" && <Bowl p={p} rng={rng} liquid />}
      {style === "assiette" && <Plate p={p} rng={rng} />}
      {style === "pates" && <Plate p={p} rng={rng} pasta />}
      {style === "verre" && <Glass p={p} rng={rng} id={safeId} />}
      {style === "wrap" && <Wraps p={p} rng={rng} />}
      {style === "plaque" && <SheetPan p={p} rng={rng} />}
      {style === "tartine" && <Toasts p={p} rng={rng} />}
      {style === "pot" && <Pot p={p} rng={rng} />}
      {style === "cocotte" && <Cocotte p={p} rng={rng} />}
      {style === "burger" && <Burger p={p} rng={rng} />}
      {style === "brochettes" && <Skewers p={p} rng={rng} />}
      {style === "papillote" && <Papillote p={p} rng={rng} />}
      {style === "gratin" && <Gratin p={p} rng={rng} />}
    </svg>
  );
}
