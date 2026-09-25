import { getIconDataUriById } from "./iconLoader.js";

const ICON_SIZE = 42;
const GAP = 14;
const PADDING = 6;

/**
 * Gera uma fileira horizontal de ícones de tecnologia (badges), no estilo
 * "skill icons" — sem card/fundo, pra flutuar direto no README (como no
 * exemplo do Maurício Spark). Quebra em várias linhas se passar de maxPerRow.
 */
export function renderSkillsRow(skillIds, maxPerRow = 12) {
  const resolved = skillIds
    .map((id) => ({ id, icon: getIconDataUriById(id) }))
    .filter((s) => s.icon);

  if (resolved.length === 0) {
    return `<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"></svg>`;
  }

  const rows = [];
  for (let i = 0; i < resolved.length; i += maxPerRow) {
    rows.push(resolved.slice(i, i + maxPerRow));
  }

  const rowWidth = Math.max(...rows.map((r) => r.length)) * (ICON_SIZE + GAP) - GAP + PADDING * 2;
  const totalHeight = rows.length * (ICON_SIZE + GAP) - GAP + PADDING * 2;

  const images = rows
    .map((row, rowIndex) =>
      row
        .map((skill, colIndex) => {
          const x = PADDING + colIndex * (ICON_SIZE + GAP);
          const y = PADDING + rowIndex * (ICON_SIZE + GAP);
          return `<image href="${skill.icon}" x="${x}" y="${y}" width="${ICON_SIZE}" height="${ICON_SIZE}" rx="8" />`;
        })
        .join("")
    )
    .join("");

  return `
<svg width="${rowWidth}" height="${totalHeight}" viewBox="0 0 ${rowWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  ${images}
</svg>`;
}
