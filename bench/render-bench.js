/**
 * Benchmark simples: mede quanto tempo leva pra gerar os SVGs dos cards,
 * usando dados falsos (sem chamar a API do GitHub). Rode com:
 *   node bench/render-bench.js
 */
import { renderStatsCard } from "../src/cards/statsCard.js";
import { renderLanguagesCard } from "../src/cards/languagesCard.js";
import { calculateRank, RANK_WEIGHTS_DEFAULT } from "../src/rank.js";

const fakeMetrics = {
  commits: 4200, prs: 180, issues: 60, reviews: 30,
  stars: 320, followers: 150, contributedTo: 40,
};

const fakeLanguages = [
  { name: "JavaScript", color: "#f1e05a", percentage: 42 },
  { name: "TypeScript", color: "#3178c6", percentage: 21 },
  { name: "CSS", color: "#563d7c", percentage: 12 },
  { name: "Python", color: "#3572A5", percentage: 9 },
  { name: "Go", color: "#00ADD8", percentage: 6 },
];

function bench(label, fn, iterations = 200) {
  for (let i = 0; i < 5; i++) fn(); // aquecimento

  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) fn();
  const end = process.hrtime.bigint();

  const totalMs = Number(end - start) / 1e6;
  console.log(`${label}: ${(totalMs / iterations).toFixed(3)} ms/render (${iterations} execuções)`);
}

const { rank, percentile } = calculateRank(fakeMetrics, RANK_WEIGHTS_DEFAULT);

bench("renderStatsCard", () => renderStatsCard({ name: "octocat", metrics: fakeMetrics, rank, percentile }, "default"));
bench("renderLanguagesCard", () => renderLanguagesCard(fakeLanguages, "default"));
bench("calculateRank", () => calculateRank(fakeMetrics, RANK_WEIGHTS_DEFAULT));
