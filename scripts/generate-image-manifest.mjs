// Liste les photos présentes dans public/images/recipes/ pour que l'interface
// sache, dès le rendu, si une recette a une photo ou un visuel de remplacement
// (aucune image cassée). Exécuté automatiquement avant `dev` et `build`.
import { readdirSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, parse } from "node:path";

const dir = join(process.cwd(), "public", "images", "recipes");
const out = join(process.cwd(), "src", "lib", "data", "image-manifest.json");
const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
const manifest = {};
for (const file of readdirSync(dir).sort()) {
  const { name, ext } = parse(file);
  if (allowed.has(ext.toLowerCase()) && !manifest[name]) manifest[name] = `/images/recipes/${file}`;
}
writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");
console.log(`[images] ${Object.keys(manifest).length} photo(s) de recette trouvée(s).`);
