import { getTheme } from "./themes.js";

const WIDTH = 460;
const HEIGHT = 220;

/**
 * Card de estatísticas: nome, lista de métricas à esquerda, anel de
 * progresso com o rank (ex.: "S+") à direita — no estilo do card
 * de referência (nome / total stars / commits / PRs / issues / contributed to).
 */
export function renderStatsCard({ name, metrics, rank, percentile }, themeName = "default") {
  const theme = getTheme(themeName);

  const lines = [
    ["\u2B50", "Total Stars", metrics.stars],
    ["\u23F1", "Total Commits", metrics.commits],
    ["\u21C5", "Total PRs", metrics.prs],
    ["\u2757", "Total Issues", metrics.issues],
    ["\uD83D\uDCD1", "Contributed to", metrics.contributedTo],
  ];

  const rows = lines
    .map(
      ([icon, label, value], i) => `
    <text x="24" y="${76 + i * 26}" font-family="Segoe UI, Roboto, sans-serif" font-size="14" fill="${theme.text}">${icon}  ${label}:</text>
    <text x="210" y="${76 + i * 26}" font-family="Segoe UI, Roboto, sans-serif" font-size="14" font-weight="700" text-anchor="end" fill="${theme.text}">${formatNumber(value)}</text>`
    )
    .join("");

  // Anel de progresso: quanto melhor o percentil (mais perto de 0), mais preenchido
  const progress = Math.max(0, Math.min(1, 1 - percentile));
  const ringCx = 372, ringCy = 118, ringR = 54;
  const circumference = 2 * Math.PI * ringR;
  const dash = circumference * progress;

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="10" fill="${theme.background}" stroke="${theme.border}" />
  <text x="24" y="34" font-family="Segoe UI, Roboto, sans-serif" font-size="19" font-weight="700" fill="${theme.title}">${escapeXml(name)}</text>
  ${rows}
  <circle cx="${ringCx}" cy="${ringCy}" r="${ringR}" fill="none" stroke="${theme.ringTrack}" stroke-width="9" />
  <circle cx="${ringCx}" cy="${ringCy}" r="${ringR}" fill="none" stroke="${theme.ring}" stroke-width="9"
    stroke-linecap="round" stroke-dasharray="${dash} ${circumference}"
    transform="rotate(-90 ${ringCx} ${ringCy})" />
  <text x="${ringCx}" y="${ringCy + 12}" font-family="Segoe UI, Roboto, sans-serif" font-size="30" font-weight="800" text-anchor="middle" fill="${theme.text}">${rank}</text>
</svg>`;
}

function formatNumber(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function escapeXml(str) {
  return String(str).replace(/[<>&'"]/g, (c) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  }[c]));
}
