// Construit dist/projet-nutrition.html : toute l'application dans UN seul fichier
// (HTML + CSS Tailwind + JavaScript + polices), utilisable par double-clic, sans serveur.
// Les données sont sauvegardées dans le localStorage du navigateur, comme la version Next.js.
import { build } from "esbuild";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const shims = join(root, "standalone", "shims");

// 1. CSS : Tailwind + polices auto-hébergées (sous-ensemble latin) encodées en base64.
const font = (pkg, file, family) => {
  const data = readFileSync(join(root, "node_modules", "@fontsource-variable", pkg, "files", file)).toString("base64");
  return `@font-face{font-family:"${family}";font-style:normal;font-display:swap;font-weight:100 900;src:url(data:font/woff2;base64,${data}) format("woff2");}`;
};
const fonts =
  font("bricolage-grotesque", "bricolage-grotesque-latin-wght-normal.woff2", "Bricolage Grotesque Variable") +
  font("dm-sans", "dm-sans-latin-wght-normal.woff2", "DM Sans Variable");

const css = await postcss([tailwindcss(join(root, "tailwind.config.ts")), autoprefixer]).process(readFileSync(join(root, "src/app/globals.css"), "utf8"), { from: "src/app/globals.css" });

// 2. JavaScript : mêmes composants, avec next/* remplacés par des équivalents navigateur.
const result = await build({
  entryPoints: [join(root, "standalone/main.tsx")],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  tsconfig: join(root, "tsconfig.json"),
  define: { "process.env.NODE_ENV": '"production"' },
  alias: {
    "next/link": join(shims, "next-link.tsx"),
    "next/navigation": join(shims, "next-navigation.ts"),
    "next/image": join(shims, "next-image.tsx"),
  },
  logOverride: { "unsupported-directive": "silent" },
  logLevel: "warning",
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

const icon = readFileSync(join(root, "public/icon.svg"), "utf8");
const html = `<!doctype html>
<html lang="fr-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#F6F3EA">
<meta name="description" content="Planification de repas personnalisée, recettes du monde, liste d'épicerie automatique et cuisine guidée pas à pas.">
<title>Projet Nutrition — vos repas de la semaine, réglés</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(icon)}">
<style>${fonts}${css.css}</style>
</head>
<body>
<div id="root"></div>
<noscript>Projet Nutrition nécessite JavaScript.</noscript>
<script>${js}</script>
</body>
</html>
`;

mkdirSync(join(root, "dist"), { recursive: true });
const out = join(root, "dist", "projet-nutrition.html");
writeFileSync(out, html);
console.log(`[html] ${out} (${(Buffer.byteLength(html) / 1024).toFixed(0)} Ko)`);
