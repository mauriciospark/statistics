/**
 * Cálculo de rank por PERCENTIL (não por pontos fixos).
 *
 * Ideia geral:
 * 1. Para cada métrica (commits, PRs, issues, reviews, stars, followers),
 *    calculamos em que percentil da distribuição geral de usuários do
 *    GitHub aquele número cai, usando uma função de distribuição estatística
 *    (exponencial para contagens de atividade, log-normal para stars e
 *    followers, que costumam ter caudas mais longas).
 * 2. Cada métrica tem um peso (RANK_WEIGHTS) — quanto maior o peso, mais
 *    aquela métrica pesa na nota final. O usuário pode ajustar esses pesos
 *    no front-end ("Rank Weights").
 * 3. Fazemos a média ponderada dos percentis => percentil final do usuário.
 * 4. Quanto MENOR o percentil (mais raro/melhor), mais alto o rank.
 *
 * As "medianas" abaixo são valores de referência aproximados (um usuário
 * "mediano" ativo do GitHub). Ajuste-os se quiser calibrar a régua.
 */

export const RANK_WEIGHTS_DEFAULT = {
  commits: 2,
  prs: 3,
  issues: 1,
  reviews: 1,
  stars: 4,
  followers: 1,
  contributedTo: 2,
};

// Valor mediano de referência para cada métrica (ajustável)
const MEDIAN = {
  commits: 1000,
  prs: 50,
  issues: 25,
  reviews: 2,
  stars: 50,
  followers: 10,
  contributedTo: 10,
};

// Métricas cuja distribuição se aproxima melhor de uma exponencial
// (atividade "de contagem": commits, PRs, issues, reviews, contributedTo)
const EXPONENTIAL_METRICS = new Set(["commits", "prs", "issues", "reviews", "contributedTo"]);
// Métricas com cauda longa (poucos usuários têm MUITO, a maioria tem pouco)
const LOGNORMAL_METRICS = new Set(["stars", "followers"]);

/** CDF da exponencial, parametrizada pela mediana (não pela média). */
function exponentialCdf(value, median) {
  const lambda = Math.log(2) / Math.max(median, 1e-6);
  return 1 - Math.exp(-lambda * Math.max(value, 0));
}

/** CDF da log-normal, parametrizada pela mediana (mu = ln(median), sigma fixo). */
function lognormalCdf(value, median, sigma = 1.2) {
  if (value <= 0) return 0;
  const mu = Math.log(Math.max(median, 1e-6));
  const z = (Math.log(value) - mu) / (sigma * Math.SQRT2);
  return 0.5 * (1 + erf(z));
}

// Aproximação numérica da função erro (Abramowitz & Stegun 7.1.26)
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741,
        a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

/**
 * Tabela de corte por percentil. Quanto menor o percentil do usuário
 * (top X%), mais alto o rank. Ampliamos o esquema clássico (9 níveis)
 * para os 11 níveis pedidos: S++, S+, S, A+, A, A-, B+, B, B-, C+, C.
 */
const RANK_THRESHOLDS = [
  { rank: "S++", maxPercentile: 0.01 },
  { rank: "S+", maxPercentile: 0.025 },
  { rank: "S", maxPercentile: 0.05 },
  { rank: "A+", maxPercentile: 0.10 },
  { rank: "A", maxPercentile: 0.20 },
  { rank: "A-", maxPercentile: 0.35 },
  { rank: "B+", maxPercentile: 0.50 },
  { rank: "B", maxPercentile: 0.65 },
  { rank: "B-", maxPercentile: 0.80 },
  { rank: "C+", maxPercentile: 0.90 },
  { rank: "C", maxPercentile: 1.0 },
];

/**
 * @param {object} metrics - { commits, prs, issues, reviews, stars, followers, contributedTo }
 * @param {object} [weights] - pesos opcionais, sobrescrevendo RANK_WEIGHTS_DEFAULT
 * @returns {{ rank: string, percentile: number, breakdown: object }}
 */
export function calculateRank(metrics, weights = {}) {
  const w = { ...RANK_WEIGHTS_DEFAULT, ...weights };
  const breakdown = {};
  let weightedSum = 0;
  let weightTotal = 0;

  for (const key of Object.keys(w)) {
    const value = metrics[key] ?? 0;
    const median = MEDIAN[key] ?? 1;
    let cdf;
    if (LOGNORMAL_METRICS.has(key)) {
      cdf = lognormalCdf(value, median);
    } else {
      cdf = exponentialCdf(value, median);
    }
    // "survival" = 1 - cdf: quanto mais perto de 0, melhor (mais raro/alto)
    const survival = 1 - cdf;
    breakdown[key] = { value, percentileTop: survival };
    weightedSum += survival * w[key];
    weightTotal += w[key];
  }

  const percentile = weightTotal > 0 ? weightedSum / weightTotal : 1;

  let rank = "C";
  for (const tier of RANK_THRESHOLDS) {
    if (percentile <= tier.maxPercentile) {
      rank = tier.rank;
      break;
    }
  }

  return { rank, percentile, breakdown };
}
