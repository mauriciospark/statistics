import { fetchGithubUser } from "../src/github.js";
import { calculateRank, RANK_WEIGHTS_DEFAULT } from "../src/rank.js";
import { renderStatsCard } from "../src/cards/statsCard.js";
import { renderLanguagesCard } from "../src/cards/languagesCard.js";
import { renderSkillsRow } from "../src/cards/skillsCard.js";
import { SKILL_GROUPS } from "../src/cards/skillsList.js";

const WEIGHT_LABELS = {
  commits: "Commits",
  prs: "Pull Requests",
  issues: "Issues",
  reviews: "Reviews",
  stars: "Stars",
  followers: "Followers",
  contributedTo: "Contributed to",
};

// Redes sociais suportadas, usando badges do shields.io (não depende de servidor nenhum)
const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    color: "E4405F",
    logo: "instagram",
    urlPrefix: "https://instagram.com/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "0A66C2",
    logo: "linkedin",
    urlPrefix: "https://linkedin.com/in/",
  },
  {
    id: "email",
    label: "Email",
    color: "D14836",
    logo: "gmail",
    urlPrefix: "mailto:",
  },
  {
    id: "twitter",
    label: "X / Twitter",
    color: "000000",
    logo: "x",
    urlPrefix: "https://x.com/",
  },
  {
    id: "youtube",
    label: "YouTube",
    color: "FF0000",
    logo: "youtube",
    urlPrefix: "https://youtube.com/@",
  },
  {
    id: "discord",
    label: "Discord",
    color: "5865F2",
    logo: "discord",
    urlPrefix: "",
  },
  {
    id: "twitch",
    label: "Twitch",
    color: "9146FF",
    logo: "twitch",
    urlPrefix: "https://twitch.tv/",
  },
  {
    id: "devto",
    label: "Dev.to",
    color: "0A0A0A",
    logo: "devdotto",
    urlPrefix: "https://dev.to/",
  },
];

const TOKEN_STORAGE_KEY = "githubReadmeCards.token";

const usernameEl = document.getElementById("username");
const displayNameEl = document.getElementById("displayName");
const titleEmojisEl = document.getElementById("titleEmojis");
const bioEl = document.getElementById("bio");
const tokenEl = document.getElementById("githubToken");
const bannerUrlsEl = document.getElementById("bannerUrls");
const themeEl = document.getElementById("theme");
const submitEl = document.getElementById("submit");
const statusEl = document.getElementById("status");
const weightsEl = document.getElementById("weights");
const skillsPickerEl = document.getElementById("skillsPicker");
const socialsPickerEl = document.getElementById("socialsPicker");

const pvTitle = document.getElementById("pvTitle");
const pvBio = document.getElementById("pvBio");
const pvSkills = document.getElementById("pvSkills");
const pvSocials = document.getElementById("pvSocials");
const pvBanners = document.getElementById("pvBanners");
const cardsImg = document.getElementById("cardsImg");
const markdownEl = document.getElementById("markdown");
const copyEl = document.getElementById("copy");
const copyStatusEl = document.getElementById("copyStatus");
const downloadsEl = document.getElementById("downloads");
const downloadCardsEl = document.getElementById("downloadCards");
const downloadSkillsEl = document.getElementById("downloadSkills");

// Guarda os SVGs gerados na última geração, pra usar nos botões de download
let lastCardsSvg = "";
let lastSkillsSvg = "";

// --- Token salvo localmente (só no navegador da pessoa) ---
tokenEl.value = localStorage.getItem(TOKEN_STORAGE_KEY) || "";
tokenEl.addEventListener("change", () => {
  localStorage.setItem(TOKEN_STORAGE_KEY, tokenEl.value.trim());
});

// --- Pesos do rank ---
for (const [key, label] of Object.entries(WEIGHT_LABELS)) {
  const wrapper = document.createElement("label");
  wrapper.innerHTML = `<span>${label}</span>`;
  const input = document.createElement("input");
  input.type = "number";
  input.step = "0.5";
  input.min = "0";
  input.value = RANK_WEIGHTS_DEFAULT[key];
  input.dataset.weight = key;
  wrapper.appendChild(input);
  weightsEl.appendChild(wrapper);
}

// --- Redes sociais: um campo de URL/usuário por rede ---
for (const social of SOCIALS) {
  const wrapper = document.createElement("label");
  wrapper.className = "field";
  wrapper.innerHTML = `<span>${social.label}</span>`;
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder =
    social.id === "email"
      ? "seu@email.com"
      : social.id === "discord"
        ? "https://discord.gg/seu-convite"
        : "seu-usuario";
  input.dataset.social = social.id;
  wrapper.appendChild(input);
  socialsPickerEl.appendChild(wrapper);
}

// --- Tecnologias: lista embutida (skillsList.js), sem precisar de servidor ---
function loadSkillsPicker() {
  for (const group of SKILL_GROUPS) {
    const groupTitle = document.createElement("div");
    groupTitle.className = "skills-group-title";
    groupTitle.textContent = group.group;
    skillsPickerEl.appendChild(groupTitle);

    const grid = document.createElement("div");
    grid.className = "skills-grid";
    for (const item of group.items) {
      const label = document.createElement("label");
      label.className = "skill-chip";
      label.innerHTML = `<input type="checkbox" value="${item.id}" /> ${item.label}`;
      grid.appendChild(label);
    }
    skillsPickerEl.appendChild(grid);
  }
}
loadSkillsPicker();

function getSelectedSkillIds() {
  return Array.from(
    skillsPickerEl.querySelectorAll("input[type=checkbox]:checked"),
  ).map((i) => i.value);
}

function getWeights() {
  const weights = {};
  weightsEl.querySelectorAll("input[data-weight]").forEach((input) => {
    weights[input.dataset.weight] = Number(input.value) || 0;
  });
  return weights;
}

function getFilledSocials() {
  return SOCIALS.map((social) => {
    const input = socialsPickerEl.querySelector(
      `input[data-social="${social.id}"]`,
    );
    const value = input.value.trim();
    if (!value) return null;
    const url =
      social.id === "email" ? `mailto:${value}` : `${social.urlPrefix}${value}`;
    return { ...social, url };
  }).filter(Boolean);
}

function getBannerUrls() {
  return bannerUrlsEl.value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function socialBadgeUrl(social) {
  return `https://img.shields.io/badge/${encodeURIComponent(social.label)}-%23${social.color}.svg?style=for-the-badge&logo=${encodeURIComponent(social.logo)}&logoColor=white`;
}

// Combina os dois cards (linguagens + stats) lado a lado num único SVG,
// igual o servidor antigo fazia — só que agora roda no navegador.
function combineCardsSideBySide(svgA, svgB) {
  const GAP = 20;
  const w = 460,
    h = 220;
  const totalWidth = w * 2 + GAP;
  return `<svg width="${totalWidth}" height="${h}" viewBox="0 0 ${totalWidth} ${h}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(0,0)">${stripSvgTag(svgA)}</g>
  <g transform="translate(${w + GAP},0)">${stripSvgTag(svgB)}</g>
</svg>`;
}

function stripSvgTag(svg) {
  return svg.replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

function svgToDataUri(svg) {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function downloadSvg(svg, filename) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildMarkdown({ title, bio, hasSkills, socials, banners }) {
  const lines = [];
  lines.push(`### ${title}`);
  if (bio) lines.push("", bio);
  lines.push("");

  if (hasSkills) {
    lines.push(`![Tecnologias](./tech-icons.svg)`, "");
  }

  if (socials.length) {
    const badges = socials
      .map((s) => `[![${s.label}](${socialBadgeUrl(s)})](${s.url})`)
      .join(" ");
    lines.push(badges, "");
  }

  for (const banner of banners) {
    lines.push(`![banner](${banner})`, "");
  }

  lines.push(`![Meus stats do GitHub](./github-cards.svg)`);

  return lines.join("\n");
}

async function generate() {
  const username = usernameEl.value.trim();
  if (!username) {
    statusEl.textContent = "Digite um usuário do GitHub.";
    return;
  }

  statusEl.textContent = "Buscando dados no GitHub...";
  submitEl.disabled = true;
  downloadsEl.style.display = "none";

  try {
    const token = tokenEl.value.trim();
    const theme = themeEl.value;
    const weights = getWeights();
    const skillIds = getSelectedSkillIds();
    const socials = getFilledSocials();
    const banners = getBannerUrls();
    const displayName = displayNameEl.value.trim() || username;
    const emojis = titleEmojisEl.value.trim();
    const bio = bioEl.value.trim();
    const title = `Olá, eu sou o(a) ${displayName}!${emojis ? " " + emojis : ""}`;

    // Preview visual (título, bio, socials, banners)
    pvTitle.textContent = title;
    pvBio.textContent = bio;
    pvBio.style.display = bio ? "block" : "none";

    pvSocials.innerHTML = socials
      .map(
        (s) =>
          `<a href="${s.url}" target="_blank" rel="noopener"><img src="${socialBadgeUrl(s)}" alt="${s.label}" /></a>`,
      )
      .join(" ");

    pvBanners.innerHTML = banners
      .map((b) => `<img src="${b}" alt="banner" />`)
      .join(" ");

    // Fileira de tecnologias (SVG gerado localmente, sem servidor)
    if (skillIds.length) {
      lastSkillsSvg = renderSkillsRow(skillIds);
      pvSkills.innerHTML = `<img src="${svgToDataUri(lastSkillsSvg)}" alt="skills" />`;
      downloadSkillsEl.style.display = "";
    } else {
      lastSkillsSvg = "";
      pvSkills.innerHTML = "";
      downloadSkillsEl.style.display = "none";
    }

    // Busca os dados reais do GitHub e gera os dois cards
    const data = await fetchGithubUser(username, token);
    const { rank, percentile } = calculateRank(data.metrics, weights);

    const statsSvg = renderStatsCard(
      { name: data.name, metrics: data.metrics, rank, percentile },
      theme,
    );
    const languagesSvg = renderLanguagesCard(data.languages, theme);
    lastCardsSvg = combineCardsSideBySide(statsSvg, languagesSvg);

    cardsImg.src = svgToDataUri(lastCardsSvg);
    downloadsEl.style.display = "";
    statusEl.textContent = "";

    markdownEl.value = buildMarkdown({
      title,
      bio,
      hasSkills: skillIds.length > 0,
      socials,
      banners,
    });
  } catch (err) {
    statusEl.textContent = err.message || "Não foi possível gerar os cards.";
  } finally {
    submitEl.disabled = false;
  }
}

submitEl.addEventListener("click", generate);
usernameEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generate();
});

downloadCardsEl.addEventListener("click", () => {
  if (lastCardsSvg) downloadSvg(lastCardsSvg, "github-cards.svg");
});
downloadSkillsEl.addEventListener("click", () => {
  if (lastSkillsSvg) downloadSvg(lastSkillsSvg, "tech-icons.svg");
});

copyEl.addEventListener("click", async () => {
  if (!markdownEl.value) return;
  await navigator.clipboard.writeText(markdownEl.value);
  copyStatusEl.textContent = "Copiado!";
  setTimeout(() => (copyStatusEl.textContent = ""), 1500);
});
