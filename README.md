# GitHub README Cards

Gera dois cards para o README do seu GitHub:
1. **Most Used Languages** — linguagem #1 em destaque, top 10 linguagens, cada uma com o logo real.
2. **Stats + Rank** — total de stars, commits, PRs, issues, contribuições, e uma nota (C até S++) calculada por **percentil estatístico**: cada métrica é comparada contra uma distribuição de referência (exponencial para atividade, log-normal para stars/followers), ponderada pelos pesos que você pode ajustar em "Ajustar pesos do rank".

**100% estático — sem servidor, sem Node instalado, sem `npm start`.** Tudo
roda direto no seu navegador: a página busca os dados do GitHub, calcula o
rank e desenha os SVGs na hora, tudo em JavaScript puro. Por isso dá pra
hospedar de graça no GitHub Pages (veja `docs/DEPLOY.md`).

## Como usar

Como o site usa `<script type="module">`, os navegadores não deixam abrir o
`index.html` clicando duas vezes direto (protocolo `file://`). Use uma destas
opções:

- Publique no GitHub Pages e acesse pela URL pública (veja `docs/DEPLOY.md`).
- Ou, pra testar localmente, use a extensão "Live Server" do VS Code, ou rode
  `python -m http.server` dentro da pasta do projeto.

Preencha o formulário, cole (opcionalmente) um token do GitHub pra evitar o
limite baixo de requisições, clique em "Gerar README", baixe as imagens
geradas e suba pro seu repositório de perfil junto com o README.

## Como gerar um token do GitHub (recomendado)

1. Vá em https://github.com/settings/tokens → "Generate new token (classic)".
2. Não precisa marcar nenhum escopo — só um token básico já aumenta bastante
   o limite de requisições da API pra leitura de dados públicos.
3. Cole o token no campo "Token do GitHub" da página. Ele fica salvo só no
   seu navegador (`localStorage`), nunca é enviado pra lugar nenhum além da
   própria API do GitHub.

## Estrutura

```
index.html          -> página do gerador (sidebar + preview), servida na raiz
favicon.ico          -> ícone do site
LICENSE              -> licença MIT
css/
  style.css          -> estilos da página
javascript/
  app.js             -> lógica do front-end (formulário, preview, downloads)
src/
  github.js          -> busca dados via API REST do GitHub, direto do navegador
  rank.js            -> cálculo do rank por percentil (não por pontos fixos)
  cards/
    themes.js          -> paletas: default (branco), highcontrast, dark
    languagesCard.js    -> gera o SVG do card de linguagens
    statsCard.js         -> gera o SVG do card de stats + rank
    skillsCard.js         -> gera a fileira de ícones de tecnologia
    skillsList.js          -> lista de tecnologias disponíveis no seletor
    iconLoader.js           -> resolve ícones de skill a partir de icons-data.js
    langIconLoader.js        -> resolve ícones de linguagem a partir de lang-icons-data.js
    icons-data.js             -> ícones de tecnologia já embutidos em base64
    lang-icons-data.js        -> logos de linguagem já embutidos em base64
favicon/
  favicon.png          -> arte-fonte do favicon
docs/
  DEPLOY.md            -> passo a passo de publicação no GitHub Pages
tests/
  rank.test.js          -> testes do cálculo de rank
  iconLoader.test.js     -> testes do carregamento de ícones
bench/
  render-bench.js        -> benchmark de tempo de renderização dos cards
```

## Testes e benchmark (opcional, precisa de Node só pra isso)

```bash
npm test    # roda os testes automatizados (node --test)
npm run bench   # mede o tempo de renderização dos cards
```

Isso é só uma conveniência pra quem for mexer no código — o site publicado
não depende de Node nem de `npm install` em nenhum momento.

## Limitações conhecidas

- Os números ficam "congelados" no momento em que você gera e baixa os
  arquivos — não há mais um servidor atualizando a imagem sob demanda a cada
  vez que alguém abre seu perfil. Gere de novo quando quiser atualizar.
- Sem token, o limite de requisições da API do GitHub é baixo (60/hora, 10/min
  pra busca) e pode falhar em contas com muitos repositórios — use um token.
- As métricas de commits/PRs/issues/reviews usam a Search API do GitHub como
  aproximação (a API GraphQL, que seria mais precisa, não permite chamadas
  via navegador por causa de CORS).
