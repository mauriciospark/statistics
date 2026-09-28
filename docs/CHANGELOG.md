# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere a [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2026-09-28

### [Added]
- Sistema completo de 36 temas de cores populares (Dracula, Nord, Tokyo Night, etc.)
- Interface moderna com design Glassmorphism e gradientes
- Sistema de seleção de tecnologias com grid interativo
- Integração com 8 redes sociais (Instagram, LinkedIn, Twitter, YouTube, Discord, Twitch, Dev.to, Email)
- Geração de Markdown autônomo com imagens embutidas (data URLs)
- Sistema de cache inteligente para evitar chamadas repetidas à API
- Preview em tempo real dos cards gerados
- Download opcional de arquivos SVG separados
- Sistema de rank personalizável com pesos ajustáveis
- Suporte a tokens GitHub para evitar limites da API
- Design responsivo para todos os dispositivos
- Documentação completa seguindo padrão Linhagem SPARK
- Sistema de scrollbars estilizadas
- Animações suaves em todos os elementos interativos
- Header padrão de documentação em todos os arquivos do projeto

### [Changed]
- Arquitetura convertida para Local-First (100% client-side)
- Removida dependência de servidor backend
- Substituído fundo branco por gradiente moderno
- Melhorada organização de cards (stats à esquerda, linguagens à direita)
- Atualizado sistema de temas com paletas mais profissionais
- Melhorada acessibilidade com contraste adequado
- Otimizado performance de geração de SVG
- Refatorado código para modularidade e manutenibilidade
- Atualizado pacote de documentação com arquivos técnicos

### [Fixed]
- Corrigido tratamento de erros na API do GitHub
- Melhorado feedback visual para estados de carregamento
- Corrigido posicionamento de elementos em dispositivos móveis
- Corrigido cache de tokens no localStorage
- Melhorado tratamento de dados faltantes da API
- Corrigido renderização de SVG em diferentes navegadores
- Melhorado escape de caracteres especiais em SVG

## [1.0.0] - 2026-09-26

### [Added]
- Geração inicial de cards SVG para README do GitHub
- Sistema básico de cálculo de rank baseado em métricas
- 3 temas iniciais (default, dark, highcontrast)
- Busca de dados do usuário via GitHub GraphQL API
- Card de estatísticas com métricas principais
- Card de linguagens mais usadas
- Interface básica para configuração de perfil
- Sistema de pesos do rank ajustável
- Preview simples dos cards gerados
- Geração de Markdown básico

### [Changed]
- Implementada arquitetura client-side inicial
- Criada estrutura modular de componentes
- Estabelecidos padrões de código e documentação

---

## Notas de Versão

### Versão 2.0.0
Esta versão representa uma reestruturação completa do projeto, transformando-o em uma aplicação moderna e profissional. A arquitetura Local-First garante privacidade e performance, enquanto o design Glassmorphism oferece uma experiência visual premium. A adição de 36 temas e integração com redes sociais expande significativamente as possibilidades de personalização.

### Versão 1.0.0
Versão inicial do projeto estabelecendo a funcionalidade básica de geração de cards SVG para perfis do GitHub. Focou em provar o conceito de geração client-side e estabelecer a base arquitetural para desenvolvimento futuro.

---

## Futuro

Próximas versões planejadas incluem:
- [ ] Extensão para navegadores
- [ ] Marketplace de temas comunitários
- [ ] Integração com LinkedIn
- [ ] Exportação para PNG/JPG
- [ ] Versão mobile-first
- [ ] Sistema de colaboração em tempo real