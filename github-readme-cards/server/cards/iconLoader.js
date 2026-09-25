import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = path.join(__dirname, "..", "..", "public", "icons");

// Nome da linguagem (como o GitHub devolve) -> nome do arquivo em public/icons
// (sem extensão). Só precisa mapear os casos que não batem com um slug simples.
const NAME_OVERRIDES = {
  "c++": "c++",
  "c#": "csharp",
  "objective-c": "objectivec",
  "objective-c++": "objectivec",
  "jupyter notebook": "jupyter",
  "vue": "vue",
  "shell": "bash",
  "dockerfile": "docker",
  "makefile": "makefile",
  "emacs lisp": "lisp",
  "common lisp": "lisp",
  "jsx": "react",
  "tsx": "react",
};

function slugify(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9+#]/g, "");
}

function resolveIconPath(languageName) {
  const key = languageName.trim().toLowerCase();
  const candidates = [
    NAME_OVERRIDES[key],
    slugify(languageName),
  ].filter(Boolean);

  for (const candidate of candidates) {
    for (const ext of [".png", ".svg", ".jpg", ".jpeg"]) {
      const filePath = path.join(ICONS_DIR, `${candidate}${ext}`);
      if (fs.existsSync(filePath)) return filePath;
    }
  }
  return null;
}

const cache = new Map();

/**
 * Retorna o data-URI base64 de um ícone pelo id exato do arquivo em
 * public/icons (sem extensão), ex: "docker", "react", "c++".
 */
export function getIconDataUriById(id) {
  const key = `id:${id}`;
  if (cache.has(key)) return cache.get(key);

  for (const ext of [".png", ".svg", ".jpg", ".jpeg"]) {
    const filePath = path.join(ICONS_DIR, `${id}${ext}`);
    if (fs.existsSync(filePath)) {
      const mime = ext === ".svg" ? "image/svg+xml" : `image/${ext === ".jpg" ? "jpeg" : ext.slice(1)}`;
      const base64 = fs.readFileSync(filePath).toString("base64");
      const dataUri = `data:${mime};base64,${base64}`;
      cache.set(key, dataUri);
      return dataUri;
    }
  }
  cache.set(key, null);
  return null;
}

/**
 * Retorna um data-URI base64 do ícone da linguagem, ou null se não existir
 * um ícone correspondente na pasta public/icons.
 */
export function getLanguageIconDataUri(languageName) {
  if (cache.has(languageName)) return cache.get(languageName);

  const filePath = resolveIconPath(languageName);
  if (!filePath) {
    cache.set(languageName, null);
    return null;
  }

  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === "svg" ? "image/svg+xml" : `image/${ext === "jpg" ? "jpeg" : ext}`;
  const base64 = fs.readFileSync(filePath).toString("base64");
  const dataUri = `data:${mime};base64,${base64}`;

  cache.set(languageName, dataUri);
  return dataUri;
}
