# Arquitetura do Sistema

## Design Arquitetural

### Local-First Architecture

O sistema adota uma arquitetura **Local-First**, onde todo o processamento acontece no navegador do usuário. Esta escolha foi baseada nos seguintes princípios:

**Privacidade de Dados**
- Nenhum dado pessoal é armazenado em servidores externos
- Tokens de API são mantidos apenas no localStorage do navegador
- O usuário tem controle total sobre suas informações

**Performance e Responsividade**
- Processamento instantâneo sem latência de rede para geração de cards
- Cache local de dados para evitar chamadas repetidas à API
- Interface reativa com feedback imediato

**Simplicidade de Deploy**
- Não requer configuração de servidores ou bancos de dados
- Funciona em qualquer ambiente com um navegador moderno
- Manutenção simplificada sem preocupações de infraestrutura

### Estrutura de Camadas

```
┌─────────────────────────────────────────┐
│           UI Layer (Frontend)          │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  index.html  │  │  style.css   │   │
│  └──────────────┘  └──────────────┘   │
│  ┌──────────────────────────────────┐ │
│  │     script.js (Application)       │ │
│  └──────────────────────────────────┘ │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│        Business Logic Layer             │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  github.js   │  │   rank.js    │   │
│  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ statsCard.js │  │langCard.js  │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│         External Services Layer         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ GitHub API   │  │  Shields.io  │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
```

## Escolhas Técnicas

### JavaScript Vanilla vs Frameworks

**Decisão**: Utilizar JavaScript puro (Vanilla JS) em vez de frameworks como React, Vue ou Angular.

**Justificativa**:
- **Performance**: Menos overhead, carregamento mais rápido
- **Simplicidade**: Menos curva de aprendizado para manutenção
- **Portabilidade**: Funciona em qualquer ambiente sem build step
- **Tamanho**: Bundle mínimo sem dependências externas
- **Manutenção**: Código mais direto e fácil de debugar

### SVG vs Imagens Raster

**Decisão**: Gerar cards em formato SVG em vez de PNG/JPG.

**Justificativa**:
- **Escalabilidade**: SVGs são vetoriais e não perdem qualidade ao redimensionar
- **Tamanho**: Arquivos menores para a mesma qualidade visual
- **Editabilidade**: SVGs podem ser modificados facilmente
- **Compatibilidade**: Suporte universal em navegadores modernos
- **Acessibilidade**: Melhor suporte para screen readers

### Data URLs vs Arquivos Externos

**Decisão**: Embutir SVGs como data URLs no Markdown gerado.

**Justificativa**:
- **Autonomia**: README funciona sem arquivos externos
- **Portabilidade**: Pode ser copiado para qualquer repositório
- **Simplicidade**: Usuário não precisa gerenciar múltiplos arquivos
- **Compartilhamento**: Fácil compartilhar código Markdown completo

### GitHub GraphQL API vs REST API

**Decisão**: Utilizar GraphQL para busca de dados do GitHub.

**Justificativa**:
- **Eficiência**: Requisições mais otimizadas, buscando apenas dados necessários
- **Flexibilidade**: Estrutura de dados mais fácil de manipular
- **Performance**: Menos requisições para obter o mesmo conjunto de dados
- **Futuro**: GitHub está migrando cada vez mais para GraphQL

## Fluxo de Dados

### 1. Interação do Usuário

```
Usuário → Interface (Inputs) → Event Listeners → Validação
```

**Processo**:
1. Usuário preenche campos (username, token, tecnologias, etc.)
2. Event listeners capturam mudanças nos inputs
3. Validação básica dos dados inseridos
4. Armazenamento de token no localStorage

### 2. Busca de Dados do GitHub

```
script.js → github.js → GitHub GraphQL API → Dados do Perfil
```

**Processo**:
1. `script.js` chama `fetchGithubUser(username, token)`
2. `github.js` constrói query GraphQL
3. Requisição é enviada para API do GitHub com headers de autenticação
4. Dados são recebidos e parseados
5. Informações são estruturadas (metrics, languages, profile)

### 3. Cálculo de Rank

```
Dados do Perfil → rank.js → Cálculo de Percentil → Atribuição de Rank
```

**Processo**:
1. Métricas são normalizadas usando distribuições estatísticas
2. Percentil é calculado para cada métrica individual
3. Média ponderada é aplicada baseada nos pesos configurados
4. Rank final é atribuído baseado no percentil resultante (S++, S+, S, A+, etc.)

### 4. Geração de Cards SVG

```
Dados + Rank → statsCard.js/languagesCard.js → Templates SVG → SVG Final
```

**Processo**:
1. Dados estruturados são passados para funções de renderização
2. Tema selecionado é aplicado (cores, fonte, etc.)
3. Template SVG é preenchido com dados reais
4. SVG é otimizado e validado

### 5. Combinação e Preview

```
SVGs Individuais → script.js → Combinação → Preview + Markdown
```

**Processo**:
1. Cards são combinados lado a lado em um SVG único
2. SVG é convertido para data URL para preview
3. Markdown é gerado com data URLs embutidas
4. Preview é atualizado em tempo real

### 6. Persistência

```
Token → localStorage (navegador)
Dados Cache → Variáveis JavaScript (temporário)
```

**Processo**:
1. Token é salvo no localStorage para uso futuro
2. Dados são cacheados em memória para re-renderização rápida
3. SVGs gerados são mantidos para download

## Privacidade e Segurança

### Proteção de Dados

**Token Management**
- Tokens são armazenados apenas no localStorage
- Nunca são enviados para servidores externos além da API GitHub
- Criptografia não é necessária pois é localStorage do próprio usuário

**Data Flow**
- Dados fluem apenas entre navegador e API GitHub
- Nenhum intermediário ou servidor proxy
- Logs não são mantidos de requisições

**API Security**
- Tokens são usados apenas para autenticação GitHub
- Escopos mínimos necessários (read-only de perfil)
- Rate limiting respeitado para evitar bloqueios

### Performance Considerations

**Caching Strategy**
- Dados de API são cacheados em memória durante a sessão
- Token persiste entre sessões via localStorage
- SVGs gerados são reutilizados para preview

**Optimization Techniques**
- Debouncing em eventos de input
- Lazy loading de componentes
- Minificação de código em produção
- SVG otimizado sem elementos desnecessários

## Escalabilidade e Manutenibilidade

**Modularidade**
- Cada componente tem responsabilidade única
- Separação clara entre UI, lógica de negócio e serviços externos
- Fácil adicionar novos temas ou funcionalidades

**Testabilidade**
- Funções puras onde possível
- Injeção de dependências para testes
- Mock fácil de APIs externas

**Documentação**
- Código bem comentado
- Estrutura de pastas lógica
- Documentação separada para arquitetura e guias

Esta arquitetura garante um sistema robusto, privado e eficiente que respeita os princípios da Linhagem SPARK de autonomia e performance.