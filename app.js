const WEIGHT_LABELS = {
<<<<<<< HEAD
  commits: "Commits", prs: "Pull Requests", issues: "Issues", reviews: "Reviews",
  stars: "Stars", followers: "Followers", contributedTo: "Contributed to",
=======
  commits: "Commits",
  prs: "Pull Requests",
  issues: "Issues",
  reviews: "Reviews",
  stars: "Stars",
  followers: "Followers",
  contributedTo: "Contributed to",
>>>>>>> 0e822c1bc30cda83f8d49a42257761e712cdc627
};
const DEFAULT_WEIGHTS = {
  commits: 2, prs: 3, issues: 1, reviews: 1, stars: 4, followers: 1, contributedTo: 2,
};

<<<<<<< HEAD
// Redes sociais suportadas, usando badges do shields.io (não depende do nosso servidor)
const SOCIALS = [
  { id: "instagram", label: "Instagram", color: "E4405F", logo: "instagram", urlPrefix: "https://instagram.com/" },
  { id: "linkedin", label: "LinkedIn", color: "0A66C2", logo: "linkedin", urlPrefix: "https://linkedin.com/in/" },
  { id: "email", label: "Email", color: "D14836", logo: "gmail", urlPrefix: "mailto:" },
  { id: "twitter", label: "X / Twitter", color: "000000", logo: "x", urlPrefix: "https://x.com/" },
  { id: "youtube", label: "YouTube", color: "FF0000", logo: "youtube", urlPrefix: "https://youtube.com/@" },
  { id: "discord", label: "Discord", color: "5865F2", logo: "discord", urlPrefix: "" },
  { id: "twitch", label: "Twitch", color: "9146FF", logo: "twitch", urlPrefix: "https://twitch.tv/" },
  { id: "devto", label: "Dev.to", color: "0A0A0A", logo: "devdotto", urlPrefix: "https://dev.to/" },
];

const usernameEl = document.getElementById("username");
const displayNameEl = document.getElementById("displayName");
const titleEmojisEl = document.getElementById("titleEmojis");
const bioEl = document.getElementById("bio");
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
=======
const weightsEl = document.getElementById("weights");
const usernameEl = document.getElementById("username");
const themeEl = document.getElementById("theme");
const submitEl = document.getElementById("submit");
const statusEl = document.getElementById("status");
const imgEl = document.getElementById("cardsImg");
>>>>>>> 0e822c1bc30cda83f8d49a42257761e712cdc627
const markdownEl = document.getElementById("markdown");
const copyEl = document.getElementById("copy");
const copyStatusEl = document.getElementById("copyStatus");

<<<<<<< HEAD
// --- Pesos do rank ---
=======
// Monta os campos numéricos de peso dinamicamente
>>>>>>> 0e822c1bc30cda83f8d49a42257761e712cdc627
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

<<<<<<< HEAD
// --- Redes sociais: um campo de URL/usuário por rede ---
for (const social of SOCIALS) {
  const wrapper = document.createElement("label");
  wrapper.className = "field";
  wrapper.innerHTML = `<span>${social.label}</span>`;
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = social.id === "email" ? "seu@email.com" : social.id === "discord" ? "https://discord.gg/seu-convite" : "seu-usuario";
  input.dataset.social = social.id;
  wrapper.appendChild(input);
  socialsPickerEl.appendChild(wrapper);
}

// --- Tecnologias: carregadas da API, agrupadas, com checkbox ---
async function loadSkillsPicker() {
  try {
    const res = await fetch("/api/skills-list");
    const data = await res.json();
    for (const group of data.groups) {
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
  } catch (err) {
    skillsPickerEl.innerHTML = `<p class="hint">Não foi possível carregar a lista (o servidor está rodando?)</p>`;
  }
}
loadSkillsPicker();

function getSelectedSkillIds() {
  return Array.from(skillsPickerEl.querySelectorAll("input[type=checkbox]:checked")).map((i) => i.value);
}

=======
>>>>>>> 0e822c1bc30cda83f8d49a42257761e712cdc627
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

<<<<<<< HEAD
function buildSkillsUrl(skillIds) {
  return `/api/skills?ids=${skillIds.map(encodeURIComponent).join(",")}`;
}

function getFilledSocials() {
  return SOCIALS.map((social) => {
    const input = socialsPickerEl.querySelector(`input[data-social="${social.id}"]`);
    const value = input.value.trim();
    if (!value) return null;
    const url = social.id === "email" ? `mailto:${value}` : `${social.urlPrefix}${value}`;
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

function buildMarkdown({ title, bio, skillsUrl, hasSkills, socials, banners, cardsUrl, origin }) {
  const lines = [];
  lines.push(`### ${title}`);
  if (bio) lines.push("", bio);
  lines.push("");

  if (hasSkills) {
    lines.push(`![Tecnologias](${origin}${skillsUrl})`, "");
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

  lines.push(`![Meus stats do GitHub](${origin}${cardsUrl})`);

  return lines.join("\n");
}

=======
>>>>>>> 0e822c1bc30cda83f8d49a42257761e712cdc627
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
<<<<<<< HEAD
  const skillIds = getSelectedSkillIds();
  const skillsUrl = buildSkillsUrl(skillIds);
  const socials = getFilledSocials();
  const banners = getBannerUrls();
  const displayName = displayNameEl.value.trim() || username;
  const emojis = titleEmojisEl.value.trim();
  const bio = bioEl.value.trim();
  const title = `Olá, eu sou o(a) ${displayName}!${emojis ? " " + emojis : ""}`;

  // Preview visual
  pvTitle.textContent = title;
  pvBio.textContent = bio;
  pvBio.style.display = bio ? "block" : "none";

  pvSkills.innerHTML = skillIds.length ? `<img src="${skillsUrl}&_=${Date.now()}" alt="skills" />` : "";

  pvSocials.innerHTML = socials
    .map((s) => `<a href="${s.url}" target="_blank" rel="noopener"><img src="${socialBadgeUrl(s)}" alt="${s.label}" /></a>`)
    .join(" ");

  pvBanners.innerHTML = banners.map((b) => `<img src="${b}" alt="banner" />`).join(" ");

  cardsImg.onload = () => { statusEl.textContent = ""; submitEl.disabled = false; };
  cardsImg.onerror = () => { statusEl.textContent = "Não foi possível gerar os cards. Confira o usuário."; submitEl.disabled = false; };
  cardsImg.src = `${cardsUrl}&_=${Date.now()}`;

  const origin = window.location.origin;
  markdownEl.value = buildMarkdown({
    title, bio, skillsUrl, hasSkills: skillIds.length > 0, socials, banners, cardsUrl, origin,
  });
=======

  imgEl.onload = () => { statusEl.textContent = ""; submitEl.disabled = false; };
  imgEl.onerror = () => { statusEl.textContent = "Não foi possível gerar os cards. Confira o usuário."; submitEl.disabled = false; };
  imgEl.src = `${cardsUrl}&_=${Date.now()}`;

  const origin = window.location.origin;
  markdownEl.value = `![Meus stats do GitHub](${origin}${cardsUrl})`;
>>>>>>> 0e822c1bc30cda83f8d49a42257761e712cdc627
}

submitEl.addEventListener("click", generate);
usernameEl.addEventListener("keydown", (e) => { if (e.key === "Enter") generate(); });

copyEl.addEventListener("click", async () => {
  if (!markdownEl.value) return;
  await navigator.clipboard.writeText(markdownEl.value);
  copyStatusEl.textContent = "Copiado!";
  setTimeout(() => (copyStatusEl.textContent = ""), 1500);
});
