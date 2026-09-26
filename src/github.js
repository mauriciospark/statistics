/**
 * Busca dados do GitHub DIRETO DO NAVEGADOR, sem servidor no meio.
 *
 * Por que REST e não GraphQL: a API GraphQL do GitHub (api.github.com/graphql)
 * não libera CORS pra chamadas feitas via JavaScript no navegador — só a API
 * REST (api.github.com/...) faz isso. Por isso todo esse arquivo foi reescrito
 * pra usar só endpoints REST (incluindo a Search API), que funcionam com
 * fetch() comum, sem precisar de proxy nem de servidor.
 *
 * O token é opcional, mas MUITO recomendado: sem token, o limite é de 60
 * requisições/hora (e só 10/min pra busca), o que estoura rápido. Com um
 * token (mesmo sem nenhum escopo marcado), o limite sobe bastante. O token
 * nunca sai do navegador da pessoa — ele é usado só nas chamadas que o
 * próprio navegador faz direto pro GitHub.
 */

const REST_URL = "https://api.github.com";

function headers(token) {
  const h = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function rest(path, token) {
  const res = await fetch(`${REST_URL}${path}`, { headers: headers(token) });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Usuário não encontrado no GitHub.");
    if (res.status === 403) throw new Error("Limite de requisições da API do GitHub atingido. Cole um token do GitHub no campo acima e tente de novo.");
    throw new Error(`Erro na API do GitHub: ${res.status}`);
  }
  return res.json();
}

/** Busca todas as páginas de um endpoint que retorna uma lista (repos, etc.) */
async function restAllPages(path, token, maxPages = 3) {
  const items = [];
  for (let page = 1; page <= maxPages; page++) {
    const sep = path.includes("?") ? "&" : "?";
    const batch = await rest(`${path}${sep}per_page=100&page=${page}`, token);
    items.push(...batch);
    if (batch.length < 100) break;
  }
  return items;
}

/** total_count de uma busca (search/issues ou search/commits) */
async function searchCount(query, token, kind = "issues") {
  try {
    const data = await rest(`/search/${kind}?q=${encodeURIComponent(query)}&per_page=1`, token);
    return data.total_count || 0;
  } catch {
    // A Search API é mais restrita; se falhar, não quebra o resto do card.
    return 0;
  }
}

/**
 * @param {string} login - usuário do GitHub
 * @param {string} [token] - Personal Access Token (opcional, recomendado)
 */
export async function fetchGithubUser(login, token) {
  const user = await rest(`/users/${encodeURIComponent(login)}`, token);

  const repos = await restAllPages(
    `/users/${encodeURIComponent(login)}/repos?type=owner`,
    token
  );
  const ownRepos = repos.filter((r) => !r.fork);

  const directStars = ownRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

  // Linguagens: só busca o detalhamento (bytes por linguagem) dos repositórios
  // com mais estrelas, pra não estourar o limite de requisições em contas com
  // muitos repositórios.
  const topByStars = [...ownRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 20);

  const languageTotals = {};
  await Promise.all(
    topByStars.map(async (repo) => {
      try {
        const langs = await rest(`/repos/${repo.full_name}/languages`, token);
        for (const [name, bytes] of Object.entries(langs)) {
          languageTotals[name] = (languageTotals[name] || 0) + bytes;
        }
      } catch {
        // Se um repo falhar (raro), só ignora e segue com o resto.
      }
    })
  );

  const totalBytes = Object.values(languageTotals).reduce((s, v) => s + v, 0) || 1;
  const languages = Object.entries(languageTotals)
    .map(([name, bytes]) => ({
      name,
      color: LANGUAGE_COLORS[name] || "#858585",
      percentage: (bytes / totalBytes) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10);

  // Métricas via Search API — aproximadas (a Search API indexa só um
  // subconjunto e não cobre tudo que a GraphQL contributionsCollection
  // cobria), mas dá uma boa estimativa sem precisar de servidor.
  const [prs, issues, reviews, commits] = await Promise.all([
    searchCount(`author:${login} type:pr`, token),
    searchCount(`author:${login} type:issue`, token),
    searchCount(`reviewed-by:${login} type:pr`, token),
    searchCount(`author:${login}`, token, "commits"),
  ]);

  // contributedTo: aproximação = repositórios de outras pessoas onde o
  // usuário tem PRs abertos (via busca), somado aos próprios repositórios.
  let contributedTo = ownRepos.length;
  try {
    const prSearch = await rest(
      `/search/issues?q=${encodeURIComponent(`author:${login} type:pr`)}&per_page=100`,
      token
    );
    const externalRepos = new Set(
      (prSearch.items || [])
        .map((item) => item.repository_url?.replace(`${REST_URL}/repos/`, ""))
        .filter((full) => full && !full.startsWith(`${login}/`))
    );
    contributedTo += externalRepos.size;
  } catch {
    // mantém só ownRepos.length se a busca falhar
  }

  const metrics = {
    commits,
    prs,
    issues,
    reviews,
    stars: directStars,
    followers: user.followers || 0,
    contributedTo,
  };

  return {
    name: user.name || user.login,
    login: user.login,
    metrics,
    languages,
  };
}

// Cores aproximadas de linguagens populares (mesmas usadas pelo GitHub Linguist),
// usadas quando não há ícone pra desenhar o quadradinho colorido.
const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Java: "#b07219", C: "#555555", "C++": "#f34b7d", "C#": "#178600",
  PHP: "#4F5D95", Go: "#00ADD8", Rust: "#dea584", Ruby: "#701516",
  Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", Elixir: "#6e4a7e",
  HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051", Vue: "#41b883",
  Scala: "#c22d40", Haskell: "#5e5086", Lua: "#000080", Perl: "#0298c3",
  Clojure: "#db5855", Erlang: "#B83998", Julia: "#a270ba", MATLAB: "#e16737",
};
