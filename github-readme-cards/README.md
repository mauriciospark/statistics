# GitHub README Cards

Gera um README completo pro seu perfil do GitHub, no estilo "Olá, eu sou fulano" com:
1. **Título + bio** — nome, emojis e uma frase curta.
2. **Fileira de tecnologias** — você escolhe entre ~54 tecnologias (usando os ícones do Material Icon Theme) e o site gera uma única imagem com todos os ícones lado a lado.
3. **Botões de redes sociais** — Instagram, LinkedIn, Email, X, YouTube, Discord, Twitch, Dev.to, usando badges do shields.io, cada um já linkado pro seu perfil.
4. **Imagens/banners** — qualquer URL de imagem que você queira incluir (logo, banner, etc).
5. **Most Used Languages + Stats/Rank** — os dois cards originais do projeto, com a nota calculada por percentil estatístico.

Tudo isso é montado num único bloco de markdown, pronto pra colar no `README.md` do seu perfil.

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

## Como publicar este código no GitHub

```bash
cd github-readme-cards
git init
git add .
git commit -m "primeira versão do gerador de README"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git
git push -u origin main
```

**Importante:** o `.env` (com seu token) não deve ir pro repositório. Crie um
arquivo `.gitignore` com a linha `.env` antes do primeiro commit, ou o commit
acima vai vazar seu token publicamente. Só o `.env.example` (sem o token de
verdade) deve ser versionado.

**Atenção:** publicar o código no GitHub não coloca o site no ar — isso só
guarda o código-fonte no repositório. Pra ter uma URL pública funcionando
(pra imagem dos cards e da fileira de tecnologias carregarem de qualquer
lugar, inclusive no seu README), você vai precisar hospedar o servidor em
algum lugar como Render ou Vercel depois.

## Estrutura

```
server/
  index.js          -> servidor Express + endpoints (/api/cards, /api/skills, /api/skills-list)
  github.js         -> busca dados via GitHub GraphQL API
  rank.js           -> cálculo do rank por percentil (não por pontos fixos)
  cards/
    themes.js          -> paletas: default (branco), highcontrast, dark
    iconLoader.js       -> carrega ícones de public/icons/ como base64
    languagesCard.js    -> gera o SVG do card de linguagens
    statsCard.js         -> gera o SVG do card de stats + rank
    skillsCard.js         -> gera o SVG da fileira de tecnologias
    skillsList.js          -> lista curada de ~54 tecnologias disponíveis
public/
  index.html / style.css / app.js  -> sidebar (esquerda) + preview (direita)
  icons/                            -> ~1080 ícones (Material Icon Theme, MIT) usados nos cards
```

## Ícones de linguagem

O card de linguagens usa os ícones reais de `public/icons/` (o mesmo pacote do
tema Material Icon Theme do VS Code). `server/cards/iconLoader.js` faz o
"de-para" do nome da linguagem (como o GitHub devolve, ex. "C++", "C#",
"Jupyter Notebook") pro nome do arquivo do ícone. Se uma linguagem não tiver
ícone correspondente, o card cai de volta pro quadradinho colorido simples.

Pra adicionar/trocar um ícone: coloque o arquivo em `public/icons/` com o
nome em minúsculas (ex. `rust.png`) — se o nome não bater automaticamente
com o nome da linguagem, adicione uma entrada em `NAME_OVERRIDES` dentro de
`server/cards/iconLoader.js`.

## Próximos passos sugeridos

- `github.js` hoje usa `contributionsCollection`, que cobre só os últimos 12 meses de commits. Para o total histórico, loope por ano desde `user.createdAt` (comentário `TODO` já deixado no arquivo).
- Adicionar mais temas em `cards/themes.js` (é só adicionar uma entrada no objeto `THEMES`).
- Trocar o cache em memória por Redis se for hospedar com múltiplas instâncias.
- Deploy sugerido: Vercel (serverless) ou Render (servidor Node sempre ligado, melhor para o cache em memória).
