# Publicar no GitHub Pages

Esse projeto agora é 100% estático — HTML, CSS e JavaScript puro rodando no
seu navegador. Ele busca os dados do GitHub direto do navegador (sem
servidor no meio), então dá pra hospedar de graça no GitHub Pages.

## Passo a passo

1. Crie um repositório no GitHub (pode ser o repositório especial de perfil,
   com o mesmo nome do seu usuário, ou qualquer outro).
2. Suba todos os arquivos deste projeto pra esse repositório.
3. Vá em **Settings → Pages** do repositório.
4. Em "Build and deployment", escolha **Deploy from a branch**, selecione a
   branch `main` e a pasta `/ (root)`.
5. Espere alguns segundos e acesse a URL que o GitHub Pages mostrar, algo
   como `https://seu-usuario.github.io/seu-repositorio/`.

## Como testar localmente antes de publicar

Como o `index.html` usa `<script type="module">`, os navegadores bloqueiam
esse tipo de script se você simplesmente abrir o arquivo clicando duas vezes
(protocolo `file://`). Você precisa de qualquer servidor de arquivos estático
local — **não precisa mais de Node nem de `npm start`** para isso. Algumas
opções simples:

- **VS Code**: instale a extensão "Live Server" e clique em "Go Live" com o
  `index.html` aberto.
- **Python** (se já tiver instalado): rode `python -m http.server` dentro da
  pasta do projeto e abra `http://localhost:8000`.
- Ou publique direto no GitHub Pages e teste na URL pública mesmo.

## Sobre o token do GitHub

O campo "Token do GitHub" na tela é opcional, mas recomendado: sem token, o
limite de requisições da API do GitHub é bem baixo (60/hora, e só 10/min para
busca) e pode falhar em contas com muitos repositórios. O token fica salvo
só no `localStorage` do seu navegador — ele nunca é commitado no repositório
nem enviado pra nenhum lugar além da própria API do GitHub.

## Sobre os números dos cards

Como não existe mais servidor gerando a imagem sob demanda, os números
(stars, commits, rank, etc.) ficam "congelados" no momento em que você clica
em "Gerar README" e baixa os arquivos `github-cards.svg` / `tech-icons.svg`.
Pra atualizar os números depois, é só voltar nesta página, gerar de novo e
substituir os arquivos no seu repositório de perfil.
