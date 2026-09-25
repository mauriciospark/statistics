import { getTheme } from "./themes.js";

const WIDTH = 460;
const HEIGHT = 220;

/**
 * Card "Most Used Languages": linguagem #1 em destaque dentro do anel à
 * direita, as outras 9 listadas em duas colunas à esquerda.
 */
export function renderLanguagesCard(languages, themeName = "default") {
  const theme = getTheme(themeName);
  const top = languages[0];
  const rest = languages.slice(1, 10);

  const colLeft = rest.filter((_, i) => i < 5);
  const colRight = rest.filter((_, i) => i >= 5);

  const row = (lang, index, x, y) => `
    <text x="${x}" y="${y}" font-family="Segoe UI, Roboto, sans-serif" font-size="13" fill="${theme.subtext}">#${index}</text>
    <circle cx="${x + 22}" cy="${y - 4}" r="5" fill="${lang.color}" />
    <text x="${x + 34}" y="${y}" font-family="Segoe UI, Roboto, sans-serif" font-size="13" fill="${theme.text}">${escapeXml(lang.name)}</text>
    <text x="${x + 150}" y="${y}" font-family="Segoe UI, Roboto, sans-serif" font-size="13" font-weight="600" fill="${theme.text}">${lang.percentage.toFixed(0)}%</text>
  `;

  const leftRows = colLeft
    .map((l, i) => row(l, i + 2, 24, 78 + i * 26))
    .join("");
  const rightRows = colRight
    .map((l, i) => row(l, i + 7, 190, 78 + i * 26))
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

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="10" fill="${theme.background}" stroke="${theme.border}" />
  <text x="24" y="34" font-family="Segoe UI, Roboto, sans-serif" font-size="17" font-weight="700" fill="${theme.text}">Most Used Languages</text>
  <text x="24" y="60" font-family="Segoe UI, Roboto, sans-serif" font-size="13" fill="${theme.subtext}">#1</text>
  <rect x="46" y="46" width="20" height="20" rx="4" fill="${top.color}" />
  <text x="72" y="60" font-family="Segoe UI, Roboto, sans-serif" font-size="14" font-weight="700" fill="${theme.text}">${escapeXml(top.name)}</text>
  <text x="200" y="60" font-family="Segoe UI, Roboto, sans-serif" font-size="14" font-weight="700" fill="${theme.text}">${top.percentage.toFixed(0)}%</text>
  ${leftRows}
  ${rightRows}
  ${arcs}
  <rect x="${ringCx - 32}" y="${ringCy - 32}" width="64" height="64" rx="6" fill="${top.color}" />
  <text x="${ringCx}" y="${ringCy + 8}" font-family="Segoe UI, Roboto, sans-serif" font-size="22" font-weight="800" text-anchor="middle" fill="#1a1a1a">${initials(top.name)}</text>
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
  return String(str).replace(/[<>&'"]/g, (c) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  }[c]));
}
