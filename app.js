const WEIGHT_LABELS = {
  commits: "Commits",
  prs: "Pull Requests",
  issues: "Issues",
  reviews: "Reviews",
  stars: "Stars",
  followers: "Followers",
  contributedTo: "Contributed to",
};
const DEFAULT_WEIGHTS = {
  commits: 2, prs: 3, issues: 1, reviews: 1, stars: 4, followers: 1, contributedTo: 2,
};

const weightsEl = document.getElementById("weights");
const usernameEl = document.getElementById("username");
const themeEl = document.getElementById("theme");
const submitEl = document.getElementById("submit");
const statusEl = document.getElementById("status");
const imgEl = document.getElementById("cardsImg");
const markdownEl = document.getElementById("markdown");
const copyEl = document.getElementById("copy");
const copyStatusEl = document.getElementById("copyStatus");

// Monta os campos numéricos de peso dinamicamente
for (const [key, label] of Object.entries(WEIGHT_LABELS)) {
  const wrapper = document.createElement("label");
  wrapper.innerHTML = `<span>${label}</span>`;
  const input = document.createElement("input");
  input.type = "number";
  input.step = "0.5";
  input.min = "0";
  input.value = DEFAULT_WEIGHTS[key];
  input.dataset.weight = key;
  wrapper.appendChild(input);
  weightsEl.appendChild(wrapper);
}

function getWeightsQuery() {
  const params = new URLSearchParams();
  weightsEl.querySelectorAll("input[data-weight]").forEach((input) => {
    params.set(input.dataset.weight, input.value);
  });
  return params;
}

function buildCardsUrl(username, theme) {
  const params = getWeightsQuery();
  params.set("theme", theme);
  return `/api/cards/${encodeURIComponent(username)}?${params.toString()}`;
}

async function generate() {
  const username = usernameEl.value.trim();
  if (!username) {
    statusEl.textContent = "Digite um usuário do GitHub.";
    return;
  }

  statusEl.textContent = "Carregando... (pode demorar um pouco na primeira vez)";
  submitEl.disabled = true;

  const theme = themeEl.value;
  const cardsUrl = buildCardsUrl(username, theme);

  imgEl.onload = () => { statusEl.textContent = ""; submitEl.disabled = false; };
  imgEl.onerror = () => { statusEl.textContent = "Não foi possível gerar os cards. Confira o usuário."; submitEl.disabled = false; };
  imgEl.src = `${cardsUrl}&_=${Date.now()}`;

  const origin = window.location.origin;
  markdownEl.value = `![Meus stats do GitHub](${origin}${cardsUrl})`;
}

submitEl.addEventListener("click", generate);
usernameEl.addEventListener("keydown", (e) => { if (e.key === "Enter") generate(); });

copyEl.addEventListener("click", async () => {
  if (!markdownEl.value) return;
  await navigator.clipboard.writeText(markdownEl.value);
  copyStatusEl.textContent = "Copiado!";
  setTimeout(() => (copyStatusEl.textContent = ""), 1500);
});
