import { test } from "node:test";
import assert from "node:assert/strict";
import { getIconDataUriById } from "../src/cards/iconLoader.js";
import { getLanguageIconDataUri } from "../src/cards/langIconLoader.js";

test("ícone de skill conhecido (javascript) resolve para um data URI válido", () => {
  const uri = getIconDataUriById("javascript");
  assert.ok(uri, "esperava um data URI, recebeu null");
  assert.match(uri, /^data:image\/(png|svg\+xml|jpeg);base64,/);
});

test("id de skill desconhecido retorna null em vez de lançar erro", () => {
  const uri = getIconDataUriById("linguagem-que-nao-existe-123");
  assert.equal(uri, null);
});

test("ícone de linguagem conhecida (Python) resolve para um data URI válido", () => {
  const uri = getLanguageIconDataUri("Python");
  assert.ok(uri, "esperava um data URI, recebeu null");
  assert.match(uri, /^data:image\/png;base64,/);
});

test("linguagem sem ícone mapeado retorna null", () => {
  const uri = getLanguageIconDataUri("Linguagem Inventada");
  assert.equal(uri, null);
});
