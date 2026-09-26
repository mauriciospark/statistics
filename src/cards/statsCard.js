import { getTheme } from "./themes.js";

const WIDTH = 460;
const HEIGHT = 220;

// Mini ícones vetoriais (estilo outline), desenhados num quadro de 16x16,
// posicionados via <g transform="translate(x,y) scale(s)">.
const ICONS = {
  star: `<path d="M8 1.5l2.02 4.09 4.52.66-3.27 3.18.77 4.5L8 11.77l-4.04 2.16.77-4.5L1.46 6.25l4.52-.66L8 1.5z" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/>`,
  clock: `<circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M8 4.3V8l2.6 1.6" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>`,
  pr: `<circle cx="4" cy="3.2" r="1.6" fill="none" stroke="currentColor" stroke-width="1.1"/><circle cx="4" cy="12.8" r="1.6" fill="none" stroke="currentColor" stroke-width="1.1"/><circle cx="12" cy="12.8" r="1.6" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M4 4.8v6.4" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M12 11.2V7.6c0-1.3-1-2.4-2.4-2.4H7" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M8.6 4l-1.8 1.2 1.8 1.2" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>`,
  issue: `<circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M8 4.6v4.4" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><circle cx="8" cy="11.2" r="0.7" fill="currentColor" stroke="none"/>`,
  contrib: `<rect x="2.8" y="1.8" width="8.4" height="11.4" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M11.2 9.5l2 2-2 2" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 4.8h4.4M5 7.3h4.4M5 9.8h2.6" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>`,
};

/**
 * Card de estatísticas: nome, lista de métricas à esquerda (com ícones
 * vetoriais no estilo outline), anel de progresso fino com o rank
 * (ex.: "S+") à direita.
 */
export function renderStatsCard({ name, metrics, rank, percentile }, themeName = "default") {
  const theme = getTheme(themeName);

  const lines = [
    ["star", "Total Stars", metrics.stars],
    ["clock", "Total Commits", metrics.commits],
    ["pr", "Total PRs", metrics.prs],
    ["issue", "Total Issues", metrics.issues],
    ["contrib", "Contributed to", metrics.contributedTo],
  ];

  const rows = lines
    .map(([iconKey, label, value], i) => {
      const y = 76 + i * 26;
      return `
    <g transform="translate(24, ${y - 12}) scale(0.95)" color="${theme.ring}">${ICONS[iconKey]}</g>
    <text x="46" y="${y}" font-family="Segoe UI, Roboto, sans-serif" font-size="14" fill="${theme.text}">${label}:</text>
    <text x="210" y="${y}" font-family="Segoe UI, Roboto, sans-serif" font-size="14" font-weight="700" text-anchor="end" fill="${theme.text}">${formatNumber(value)}</text>`;
    })
    .join("");

  // Anel de progresso fino: quanto melhor o percentil (mais perto de 0), mais preenchido
  const progress = Math.max(0, Math.min(1, 1 - percentile));
  const ringCx = 372, ringCy = 118, ringR = 58;
  const ringWidth = 5;
  const circumference = 2 * Math.PI * ringR;
  const dash = circumference * progress;

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="10" fill="${theme.background}" stroke="${theme.border}" />
  <text x="24" y="34" font-family="Segoe UI, Roboto, sans-serif" font-size="19" font-weight="700" fill="${theme.title}">${escapeXml(name)}</text>
  ${rows}
  <circle cx="${ringCx}" cy="${ringCy}" r="${ringR}" fill="none" stroke="${theme.ringTrack}" stroke-width="${ringWidth}" />
  <circle cx="${ringCx}" cy="${ringCy}" r="${ringR}" fill="none" stroke="${theme.ring}" stroke-width="${ringWidth}"
    stroke-linecap="round" stroke-dasharray="${dash} ${circumference}"
    transform="rotate(-90 ${ringCx} ${ringCy})" />
  <text x="${ringCx}" y="${ringCy + 14}" font-family="Segoe UI, Roboto, sans-serif" font-size="34" font-weight="700" text-anchor="middle" fill="${theme.text}">${rank}</text>
</svg>`;
}

function formatNumber(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function escapeXml(str) {
  return String(str).replace(/[<>&\'"]/g, (c) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  }[c]));
}
