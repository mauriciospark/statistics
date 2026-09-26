import { LANG_ICONS } from "./lang-icons-data.js";

// Nome da linguagem (como o GitHub retorna) -> id no manifesto LANG_ICONS
const LANG_ICON_MAP = {
  JavaScript: "javascript", TypeScript: "typescript", Python: "python",
  Java: "java", C: "c", "C++": "c++", "C#": "csharp", PHP: "php",
  Go: "go", Rust: "rust", Ruby: "ruby", Swift: "swift", Kotlin: "kotlin",
  Dart: "dart", Elixir: "elixir", HTML: "html", CSS: "css",
  Shell: "bash", Vue: "vue", Scala: "scala", Haskell: "haskell",
  Lua: "lua", Perl: "perl", Clojure: "clojure",
  Erlang: "erlang", Julia: "julia", MATLAB: "matlab",
};

/** Retorna um data: URI para o ícone da linguagem, ou null se não existir. */
export function getLanguageIconDataUri(languageName) {
  const iconId = LANG_ICON_MAP[languageName];
  if (!iconId) return null;
  return LANG_ICONS[iconId] || null;
}
