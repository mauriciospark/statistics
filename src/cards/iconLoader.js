import { SKILL_ICONS } from "./icons-data.js";

/**
 * Resolve um id de skill (ex.: "react") para um data: URI.
 * Os ícones já vêm embutidos em icons-data.js (gerado a partir dos PNGs/SVGs
 * originais), então isso funciona 100% no navegador, sem precisar de fetch
 * nem de servidor. Retorna null se o id não existir, para o card
 * simplesmente pular aquele ícone em vez de quebrar.
 */
export function getIconDataUriById(id) {
  return SKILL_ICONS[id] || null;
}
