import fetch from "node-fetch";

const GRAPHQL_URL = "https://api.github.com/graphql";
const REST_URL = "https://api.github.com";

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": "github-readme-cards",
  };
}

async function graphql(query, variables) {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`GitHub GraphQL error: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`GitHub GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function rest(path) {
  const res = await fetch(`${REST_URL}${path}`, { headers: headers() });
  if (!res.ok) {
    throw new Error(`GitHub REST error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const PROFILE_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      name
      login
      followers { totalCount }
      repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
        totalCount
      }
      pullRequests(first: 1) { totalCount }
      issues(first: 1) { totalCount }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestReviewContributions
        restrictedContributionsCount
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        nodes {
          name
          stargazerCount
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
    }
  }
`;

/**
 * Busca perfil, métricas de atividade e linguagens mais usadas de um usuário.
 * OBS: totalCommitContributions da contributionsCollection só cobre os
 * últimos 12 meses. Para um total histórico completo seria necessário somar
 * várias janelas anuais (from/to) desde a criação da conta — deixado como
 * próximo passo/TODO, indicado nos comentários abaixo.
 */
export async function fetchGithubUser(login) {
  const data = await graphql(PROFILE_QUERY, { login });
  const user = data.user;
  if (!user) {
    throw new Error(`Usuário "${login}" não encontrado`);
  }

  // Soma estrelas diretas de todos os repositórios próprios
  const directStars = user.repositories.nodes.reduce(
    (sum, repo) => sum + repo.stargazerCount,
    0
  );

  // Agrega bytes de linguagem por repositório -> porcentagem geral
  const languageTotals = {};
  for (const repo of user.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const lang = edge.node.name;
      languageTotals[lang] = languageTotals[lang] || { size: 0, color: edge.node.color };
      languageTotals[lang].size += edge.size;
    }
  }
  const totalBytes = Object.values(languageTotals).reduce((s, l) => s + l.size, 0) || 1;
  const languages = Object.entries(languageTotals)
    .map(([name, { size, color }]) => ({
      name,
      color: color || "#858585",
      percentage: (size / totalBytes) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10);

  // TODO: para cobrir todos os anos, faça um loop de graphql() com
  // contributionsCollection(from: <ano>-01-01, to: <ano>-12-31) desde o ano
  // de criação da conta (user.createdAt) até hoje, somando os contadores.
  const metrics = {
    commits: user.contributionsCollection.totalCommitContributions,
    prs: user.pullRequests.totalCount,
    issues: user.issues.totalCount,
    reviews: user.contributionsCollection.totalPullRequestReviewContributions,
    stars: directStars,
    followers: user.followers.totalCount,
    contributedTo: user.repositoriesContributedTo.totalCount,
  };

  return {
    name: user.name || user.login,
    login: user.login,
    metrics,
    languages,
  };
}
