/**
 * Lista curada de tecnologias que aparecem no seletor "Tecnologias".
 * O campo `icon` precisa bater com um arquivo em public/icons/ (sem extensão).
 * Agrupado só para organizar o front-end; o back-end trata tudo como uma lista simples.
 */
export const SKILL_GROUPS = [
  {
    group: "Linguagens",
    items: [
      { id: "javascript", label: "JavaScript" },
      { id: "typescript", label: "TypeScript" },
      { id: "python", label: "Python" },
      { id: "java", label: "Java" },
      { id: "c", label: "C" },
      { id: "c++", label: "C++" },
      { id: "csharp", label: "C#" },
      { id: "php", label: "PHP" },
      { id: "go", label: "Go" },
      { id: "rust", label: "Rust" },
      { id: "ruby", label: "Ruby" },
      { id: "swift", label: "Swift" },
      { id: "kotlin", label: "Kotlin" },
      { id: "dart", label: "Dart" },
      { id: "elixir", label: "Elixir" },
      { id: "html", label: "HTML" },
      { id: "css", label: "CSS" },
    ],
  },
  {
    group: "Frameworks & Libs",
    items: [
      { id: "react", label: "React" },
      { id: "vue", label: "Vue" },
      { id: "angular", label: "Angular" },
      { id: "nextjs", label: "Next.js" },
      { id: "nuxt", label: "Nuxt" },
      { id: "svelte", label: "Svelte" },
      { id: "express", label: "Express" },
      { id: "nodejs", label: "Node.js" },
      { id: "django", label: "Django" },
      { id: "flask", label: "Flask" },
      { id: "spring", label: "Spring" },
      { id: "laravel", label: "Laravel" },
      { id: "rails", label: "Rails" },
      { id: "dotnet", label: ".NET" },
      { id: "tailwindcss", label: "Tailwind" },
      { id: "sass", label: "Sass" },
    ],
  },
  {
    group: "Banco de Dados & Infra",
    items: [
      { id: "mongodb", label: "MongoDB" },
      { id: "mysql", label: "MySQL" },
      { id: "postgresql", label: "PostgreSQL" },
      { id: "redis", label: "Redis" },
      { id: "docker", label: "Docker" },
      { id: "kubernetes", label: "Kubernetes" },
      { id: "aws", label: "AWS" },
      { id: "azure", label: "Azure" },
      { id: "firebase", label: "Firebase" },
      { id: "nginx", label: "Nginx" },
      { id: "linux", label: "Linux" },
      { id: "ubuntu", label: "Ubuntu" },
    ],
  },
  {
    group: "Ferramentas",
    items: [
      { id: "git", label: "Git" },
      { id: "github", label: "GitHub" },
      { id: "figma", label: "Figma" },
      { id: "postman", label: "Postman" },
      { id: "vim", label: "Vim" },
      { id: "vite", label: "Vite" },
      { id: "webpack", label: "Webpack" },
      { id: "graphql", label: "GraphQL" },
      { id: "markdown", label: "Markdown" },
    ],
  },
];

export const ALL_SKILL_IDS = SKILL_GROUPS.flatMap((g) => g.items.map((i) => i.id));
