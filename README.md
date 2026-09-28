# GitHub README Cards Generator — (Linhagem SPARK)

## Descrição

Um gerador profissional de cards SVG para README do GitHub que permite desenvolvedores criarem perfis visuais impressionantes. O sistema resolve o problema de apresentar estatísticas e tecnologias de forma atraente em perfis do GitHub, eliminando a necessidade de servidores backend e processando tudo localmente no navegador do usuário.

## Stack

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilização moderna com variáveis CSS e Glassmorphism
- **JavaScript (ES6+)**: Lógica de aplicação e processamento de dados
- **SVG**: Geração dinâmica de gráficos e cards

### Bibliotecas e Ferramentas
- **Vanilla JavaScript**: Sem frameworks externos para máxima performance
- **GitHub GraphQL API**: Busca de dados de perfil e repositórios
- **Shields.io**: Badges de redes sociais
- **Local Storage**: Persistência de tokens de API

### Ferramentas de Desenvolvimento
- **Node.js**: Ambiente de desenvolvimento e testes
- **Git**: Controle de versão

## Funcionalidades

- ✅ **Geração de Cards SVG Dinâmicos**: Cards de estatísticas e linguagens com dados reais do GitHub
- ✅ **Sistema de Rank Personalizável**: Cálculo de rank baseado em métricas com pesos ajustáveis
- ✅ **36 Temas de Cores**: Paleta extensa de temas populares (Dracula, Nord, Tokyo Night, etc.)
- ✅ **Integração com Redes Sociais**: Badges interativos para Instagram, LinkedIn, Twitter, YouTube, Discord, etc.
- ✅ **Seleção de Tecnologias**: Grid interativo de tecnologias com ícones
- ✅ **Markdown Autônomo**: Geração de código completo com imagens embutidas (data URLs)
- ✅ **Preview em Tempo Real**: Visualização instantânea dos cards gerados
- ✅ **Download de Arquivos SVG**: Opção de baixar cards separados para uso externo
- ✅ **100% Client-Side**: Funciona completamente no navegador, sem servidor backend
- ✅ **Token GitHub Opcional**: Suporte a tokens para evitar limites da API
- ✅ **Design Responsivo**: Interface adaptável para diferentes tamanhos de tela
- ✅ **Glassmorphism**: Design moderno com efeitos de vidro e transparência

## Como Rodar

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet para acessar a API do GitHub

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/mauriciospark/github-readme-cards.git
   cd github-readme-cards
   ```

2. **Abra o arquivo index.html**
   - Simplesmente abra o arquivo `index.html` no seu navegador
   - Não é necessário instalar dependências ou configurar servidor

3. **Configure seu perfil**
   - Insira seu usuário do GitHub
   - (Opcional) Adicione um token GitHub para evitar limites da API
   - Selecione as tecnologias que deseja mostrar
   - Configure redes sociais se desejar
   - Escolha o tema preferido

4. **Gere seus cards**
   - Clique em "Gerar README"
   - Visualize o preview em tempo real
   - Copie o código Markdown gerado
   - Cole no seu README.md do GitHub

### Desenvolvimento Local

Para desenvolvimento e testes:

```bash
# Instale as dependências (opcional, apenas para testes)
npm install

# Execute os testes
npm test

# Execute benchmarks
npm run bench
```

## Licença

MIT License - Copyright © 2026 Mauricio Spark. Todos os direitos reservados.