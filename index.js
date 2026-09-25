import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchGithubUser } from "./github.js";
import { calculateRank, RANK_WEIGHTS_DEFAULT } from "./rank.js";
import { renderLanguagesCard } from "./cards/languagesCard.js";
import { renderStatsCard } from "./cards/statsCard.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_MS = (Number(process.env.CACHE_MINUTES) || 30) * 60 * 1000;

// Cache em memória simples: username+weights -> { data, expires }
const cache = new Map();

app.use(express.static(path.join(__dirname, "..", "public")));

async function getUserData(login, weights) {
  const key = `${login}:${JSON.stringify(weights)}`;
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;

  const profile = await fetchGithubUser(login);
  const { rank, percentile } = calculateRank(profile.metrics, weights);
  const data = { ...profile, rank, percentile };

  cache.set(key, { data, expires: Date.now() + CACHE_MS });
  return data;
}

function parseWeights(query) {
  const weights = { ...RANK_WEIGHTS_DEFAULT };
  for (const key of Object.keys(weights)) {
    if (query[key] !== undefined) {
      const v = Number(query[key]);
      if (!Number.isNaN(v)) weights[key] = v;
    }
  }
  return weights;
}

// Um único endpoint que devolve os DOIS cards já combinados em um SVG,
// lado a lado — assim o README precisa de uma única linha de markdown.
app.get("/api/cards/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const theme = req.query.theme || "default";
    const weights = parseWeights(req.query);

    const data = await getUserData(username, weights);
    const languagesSvg = renderLanguagesCard(data.languages, theme);
    const statsSvg = renderStatsCard(data, theme);

    const combined = combineCardsSideBySide(languagesSvg, statsSvg);

    res.set("Content-Type", "image/svg+xml");
    res.set("Cache-Control", "public, max-age=1800");
    res.send(combined);
  } catch (err) {
    res.status(500).set("Content-Type", "image/svg+xml").send(errorSvg(err.message));
  }
});

// Endpoint auxiliar em JSON, útil para o preview no front-end saber o rank etc.
app.get("/api/data/:username", async (req, res) => {
  try {
    const weights = parseWeights(req.query);
    const data = await getUserData(req.params.username, weights);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function combineCardsSideBySide(svgA, svgB) {
  const GAP = 20;
  const w = 460, h = 220;
  const totalWidth = w * 2 + GAP;
  return `<svg width="${totalWidth}" height="${h}" viewBox="0 0 ${totalWidth} ${h}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(0,0)">${stripSvgTag(svgA)}</g>
  <g transform="translate(${w + GAP},0)">${stripSvgTag(svgB)}</g>
</svg>`;
}

function stripSvgTag(svg) {
  return svg.replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

function errorSvg(message) {
  return `<svg width="460" height="120" xmlns="http://www.w3.org/2000/svg">
  <rect width="460" height="120" fill="#fff0f0" stroke="#e88" rx="8"/>
  <text x="20" y="40" font-family="sans-serif" font-size="14" fill="#a00">Erro ao gerar o card</text>
  <text x="20" y="64" font-family="sans-serif" font-size="12" fill="#a00">${escapeXml(message).slice(0, 60)}</text>
</svg>`;
}

function escapeXml(str) {
  return String(str).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
}

app.listen(PORT, () => {
  console.log(`github-readme-cards rodando em http://localhost:${PORT}`);
});
