import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateRank, RANK_WEIGHTS_DEFAULT } from "../src/rank.js";

test("um usuário com métricas muito altas recebe um rank de topo (S ou melhor)", () => {
  const metrics = {
    commits: 20000,
    prs: 2000,
    issues: 500,
    reviews: 500,
    stars: 5000,
    followers: 3000,
    contributedTo: 300,
  };
  const { rank, percentile } = calculateRank(metrics, RANK_WEIGHTS_DEFAULT);
  assert.ok(["S++", "S+", "S"].includes(rank), `esperava S/S+/S++, recebeu ${rank}`);
  assert.ok(percentile <= 0.05);
});

test("um usuário sem nenhuma atividade recebe o rank mais baixo (C)", () => {
  const metrics = {
    commits: 0,
    prs: 0,
    issues: 0,
    reviews: 0,
    stars: 0,
    followers: 0,
    contributedTo: 0,
  };
  const { rank } = calculateRank(metrics, RANK_WEIGHTS_DEFAULT);
  assert.equal(rank, "C");
});

test("pesos customizados são aplicados sem quebrar o cálculo", () => {
  const metrics = { commits: 500, prs: 20, issues: 10, reviews: 1, stars: 20, followers: 5, contributedTo: 5 };
  const result = calculateRank(metrics, { ...RANK_WEIGHTS_DEFAULT, stars: 10 });
  assert.ok(result.percentile >= 0 && result.percentile <= 1);
  assert.ok(typeof result.rank === "string");
});
