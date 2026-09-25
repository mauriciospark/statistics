# GitHub README Cards

Gera dois cards para o README do seu GitHub:
1. **Most Used Languages** — linguagem #1 em destaque, top 10 linguagens.
2. **Stats + Rank** — total de stars, commits, PRs, issues, contribuições, e uma nota (C até S++) calculada por **percentil estatístico** (não por pontos fixos): cada métrica é comparada contra uma distribuição de referência (exponencial para atividade, log-normal para stars/followers), ponderada pelos pesos que você pode ajustar em "Rank Weights".

Os dois cards saem como **um único SVG combinado**, então o README precisa de **uma única linha de markdown**.

## Como rodar

```bash
npm install
cp .env.example .env
# edite o .env e cole seu GitHub token em GITHUB_TOKEN
npm start
```

Abra `http://localhost:3000`.

## Como gerar um token do GitHub

1. Vá em https://github.com/settings/tokens → "Generate new token (classic)".
2. Marque só o escopo `read:user` (leitura pública já é suficiente).
3. Copie o token para `.env`.

## Estrutura

```
server/
  index.js          -> servidor Express + endpoint /api/cards/:username
  github.js         -> busca dados via GitHub GraphQL API
  rank.js           -> cálculo do rank por percentil (não por pontos fixos)
  cards/
    themes.js        -> paletas: default (branco), highcontrast, dark
    languagesCard.js  -> gera o SVG do card de linguagens
    statsCard.js       -> gera o SVG do card de stats + rank
public/
  index.html / style.css / app.js  -> sidebar (esquerda) + preview (direita)
```

## Próximos passos sugeridos

- `github.js` hoje usa `contributionsCollection`, que cobre só os últimos 12 meses de commits. Para o total histórico, loope por ano desde `user.createdAt` (comentário `TODO` já deixado no arquivo).
- Adicionar mais temas em `cards/themes.js` (é só adicionar uma entrada no objeto `THEMES`).
- Trocar o cache em memória por Redis se for hospedar com múltiplas instâncias.
- Deploy sugerido: Vercel (serverless) ou Render (servidor Node sempre ligado, melhor para o cache em memória).
