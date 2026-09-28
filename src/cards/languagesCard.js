import { getTheme } from "./themes.js";
import { getLanguageIconDataUri } from "./langIconLoader.js";

const WIDTH = 460;
const HEIGHT = 220;

/**
 * Card "Most Used Languages": linguagem #1 em destaque com o logo dentro
 * de um quadrado colorido, dentro do anel à direita; as outras 9 listadas
 * em duas colunas à esquerda, cada uma com um quadradinho com o logo (ou,
 * se não houver ícone, um quadradinho só na cor da linguagem).
 */
const REST_LIMIT = 4; // além do #1 em destaque, lista mais 4 (5 no total)
const ROW_HEIGHT = 34;
const BAR_X = 44;
const BAR_WIDTH = 260;
const BAR_HEIGHT = 6;

export function renderLanguagesCard(languages, themeName = "default") {
  const theme = getTheme(themeName);
  const top = languages[0];
  const rest = languages.slice(1, 1 + REST_LIMIT);

  const swatch = (lang, x, y, size = 16) => {
    const icon = getLanguageIconDataUri(lang.name);
    if (icon) {
      return `<image href="${icon}" x="${x}" y="${y - size + 3}" width="${size}" height="${size}" />`;
    }
    return `<rect x="${x}" y="${y - size + 3}" width="${size}" height="${size}" rx="4" fill="${lang.color}" />`;
  };

  // Cada linguagem ganha seu próprio contador de 0% a 100%, numa barra
  // organizada em coluna única (nome + % numa linha, barra logo abaixo).
  const row = (lang, index, y) => {
    const pct = Math.max(0, Math.min(100, lang.percentage));
    const filledWidth = (pct / 100) * BAR_WIDTH;
    const barY = y + 8;
    return `
    <text x="24" y="${y}" font-family="Segoe UI, Roboto, sans-serif" font-size="12" fill="${theme.subtext}">#${index}</text>
    ${swatch(lang, BAR_X, y, 15)}
    <text x="${BAR_X + 22}" y="${y}" font-family="Segoe UI, Roboto, sans-serif" font-size="13" fill="${theme.text}">${escapeXml(lang.name)}</text>
    <text x="${BAR_X + BAR_WIDTH}" y="${y}" font-family="Segoe UI, Roboto, sans-serif" font-size="12" font-weight="700" text-anchor="end" fill="${theme.text}">${pct.toFixed(0)}%</text>
    <rect x="${BAR_X}" y="${barY}" width="${BAR_WIDTH}" height="${BAR_HEIGHT}" rx="${BAR_HEIGHT / 2}" fill="${theme.ringTrack}" />
    <rect x="${BAR_X}" y="${barY}" width="${filledWidth}" height="${BAR_HEIGHT}" rx="${BAR_HEIGHT / 2}" fill="${lang.color}" />`;
  };

  const rows = rest
    .map((l, i) => row(l, i + 2, 92 + i * ROW_HEIGHT))
    .join("");

  // Anel de cores proporcional à % de cada linguagem (donut simplificado)
  const ringCx = 380, ringCy = 120, ringR = 46;
  let angleStart = -90;
  const arcs = languages
    .slice(0, 10)
    .map((l) => {
      const angle = (l.percentage / 100) * 360;
      const arc = describeArc(ringCx, ringCy, ringR, angleStart, angleStart + angle, l.color);
      angleStart += angle;
      return arc;
    })
    .join("");

  const topIcon = getLanguageIconDataUri(top.name);
  const topBadge = topIcon
    ? `<rect x="46" y="46" width="20" height="20" rx="4" fill="#ffffff" stroke="${theme.border}" /><image href="${topIcon}" x="49" y="49" width="14" height="14" />`
    : `<rect x="46" y="46" width="20" height="20" rx="4" fill="${top.color}" />`;

  const ringIcon = topIcon
    ? `<rect x="${ringCx - 32}" y="${ringCy - 32}" width="64" height="64" rx="10" fill="#ffffff" stroke="${theme.border}" /><image href="${topIcon}" x="${ringCx - 22}" y="${ringCy - 22}" width="44" height="44" />`
    : `<rect x="${ringCx - 32}" y="${ringCy - 32}" width="64" height="64" rx="10" fill="${top.color}" /><text x="${ringCx}" y="${ringCy + 8}" font-family="Segoe UI, Roboto, sans-serif" font-size="22" font-weight="800" text-anchor="middle" fill="#1a1a1a">${initials(top.name)}</text>`;

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="10" fill="${theme.background}" stroke="${theme.border}" />
  <text x="24" y="34" font-family="Segoe UI, Roboto, sans-serif" font-size="17" font-weight="700" fill="${theme.text}">Most Used Languages</text>
  <text x="24" y="60" font-family="Segoe UI, Roboto, sans-serif" font-size="13" fill="${theme.subtext}">#1</text>
  ${topBadge}
  <text x="72" y="60" font-family="Segoe UI, Roboto, sans-serif" font-size="14" font-weight="700" fill="${theme.text}">${escapeXml(top.name)}</text>
  <text x="200" y="60" font-family="Segoe UI, Roboto, sans-serif" font-size="14" font-weight="700" fill="${theme.text}">${top.percentage.toFixed(0)}%</text>
  ${rows}
  ${arcs}
  ${ringIcon}
</svg>`;
}

function initials(name) {
  return name.slice(0, 2).toUpperCase();
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle, color) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  const d = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  return `<path d="${d}" stroke="${color}" stroke-width="10" fill="none" stroke-linecap="round" />`;
}

function escapeXml(str) {
  return String(str).replace(/[<>&\'"]/g, (c) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  }[c]));
}
