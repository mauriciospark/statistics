# Guia de Contribuição

## Boas Práticas

### Código de Conduta

Ao contribuir com este projeto, você concorda em:
- Respeitar todos os contribuidores e usuários
- Fornecer feedback construtivo e respeitoso
- Seguir os padrões de código estabelecidos
- Testar suas alterações antes de submeter
- Documentar mudanças significativas

### Processo de Contribuição

1. **Fork o Repositório**
   - Crie um fork do projeto no seu GitHub
   - Clone seu fork localmente

2. **Branch Naming**
   - Use branches descritivos seguindo o padrão:
     - `feature/nome-da-feature` para novas funcionalidades
     - `fix/nome-do-bug` para correções de bugs
     - `docs/nome-da-documentacao` para atualizações de documentação
     - `refactor/nome-da-refatoracao` para refatorações
     - `test/nome-do-teste` para adições de testes

3. **Desenvolvimento**
   - Siga os padrões de código estabelecidos
   - Adicione testes para novas funcionalidades
   - Atualize a documentação conforme necessário
   - Mantenha commits atomicos e descritivos

4. **Pull Request**
   - Descreva claramente o propósito da sua PR
   - Referencie issues relacionadas se existirem
   - Inclua screenshots para mudanças visuais
   - Aguarde revisão dos mantenedores

## Padrões de Código

### JavaScript

**Formatação**
- Use 2 espaços para indentação
- Use aspas simples para strings
- Use ponto e vírgula no final das linhas
- Use camelCase para variáveis e funções
- Use PascalCase para classes e construtores

**Nomenclatura**
```javascript
// Variáveis e funções
const userName = 'mauriciospark';
function calculateRank() { }

// Constantes
const MAX_RETRIES = 3;
const API_URL = 'https://api.github.com';

// Classes
class CardRenderer { }
```

**Comentários**
- Use JSDoc para funções exportadas
- Comente lógica complexa quando necessário
- Mantenha comentários atualizados com o código

```javascript
/**
 * Calcula o rank do usuário baseado nas métricas fornecidas
 * @param {Object} metrics - Métricas do GitHub
 * @param {Object} weights - Pesos personalizados
 * @returns {Object} - Rank e percentil calculados
 */
function calculateRank(metrics, weights) {
  // Lógica de cálculo
}
```

### CSS

**Organização**
- Use variáveis CSS para cores e valores repetitivos
- Agrupe estilos relacionados
- Use BEM naming quando apropriado
- Mantenha seletores específicos e performáticos

```css
/* Variáveis */
:root {
  --primary-color: #667eea;
  --border-radius: 8px;
}

/* Componentes */
.card {
  background: var(--panel);
  border-radius: var(--border-radius);
}

.card__title {
  font-size: 18px;
  font-weight: 600;
}
```

### HTML

**Estrutura**
- Use elementos semânticos HTML5
- Mantenha hierarquia correta de headings
- Inclua atributos de acessibilidade
- Valide HTML com W3C Validator

```html
<section class="sidebar">
  <h1>GitHub README Generator</h1>
  <form class="user-form">
    <label for="username">Usuário do GitHub</label>
    <input id="username" type="text" required aria-label="Nome de usuário do GitHub">
  </form>
</section>
```

## Validações Obrigatórias

### Antes de Submeter

**Código**
- [ ] Código segue os padrões estabelecidos
- [ ] Não há console.log() ou código de debug
- [ ] Variáveis e funções têm nomes descritivos
- [ ] Complexidade ciclomática aceitável
- [ ] Não há código duplicado significativo

**Testes**
- [ ] Testes existentes continuam passando
- [ ] Novos testes foram adicionados para funcionalidades novas
- [ ] Cobertura de testes não diminuiu
- [ ] Testes de edge cases foram considerados

**Documentação**
- [ ] README foi atualizado se necessário
- [ ] Comentários no código são claros
- [ ] Changes relevantes foram documentados em CHANGELOG.md
- [ ] Breaking changes foram claramente documentados

**Performance**
- [ ] Não há regressões de performance
- [ ] Código é eficiente em recursos
- [ ] Não há memory leaks
- [ ] Tempo de carregamento permanece aceitável

**Acessibilidade**
- [ ] Componentes são acessíveis via teclado
- [ ] Cores têm contraste adequado
- [ ] ARIA labels foram usados quando necessário
- [ ] Screen readers podem interpretar o conteúdo

## Estilo de Commits

**Formato de Mensagem**
```
tipo(escopo): descrição breve

Descrição detalhada opcional

- bullet point para mudanças
- outro bullet point
```

**Tipos Permitidos**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças apenas na documentação
- `style`: Mudanças de formatação/estilo (sem impacto no código)
- `refactor`: Refatoração de código
- `perf`: Melhoria de performance
- `test`: Adição/modificação de testes
- `chore': Mudanças em processo de build/tools

**Exemplos**
```
feat(ui): adicionar suporte a tema escuro

Implementou sistema de temas com suporte a modo escuro
baseado nas preferências do sistema do usuário.

- Adicionado detector de preferências de tema
- Criado tema dark com paleta de cores apropriada
- Atualizada documentação com novos temas
```

```
fix(api): corrigir tratamento de erro na chamada GraphQL

Corrigiu erro que causava falha silenciosa quando a API do GitHub
retornava erro de rate limiting.

- Adicionado tratamento específico para erro 429
- Implementado retry automático com backoff exponencial
- Adicionado feedback visual para usuário
```

## Padrões de Organização

### Estrutura de Arquivos

```
statistics/
├── docs/                    # Documentação
│   ├── README.md
│   ├── ABOUT.md
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   └── CHANGELOG.md
├── src/                     # Código fonte
│   ├── cards/              # Componentes de cards
│   ├── github.js           # Integração GitHub API
│   ├── rank.js             # Lógica de cálculo de rank
│   └── package.json        # Configuração do projeto
├── css/                    # Estilos
│   └── style.css
├── javascript/             # Scripts da aplicação
│   └── script.js
├── tests/                  # Testes
├── bench/                  # Benchmarks
└── index.html              # Página principal
```

### Convenções de Branch

**Branches Principais**
- `main`: Branch de produção estável
- `develop`: Branch de desenvolvimento (se usado)

**Branches de Feature**
- `feature/nome-da-feature`: Para novas funcionalidades
- `bugfix/nome-do-bug`: Para correções urgentes
- `hotfix/nome-do-hotfix`: Para correções em produção

### Code Review

**Para Reviewers**
- Revise de forma construtiva e respeitosa
- Foque em código, não na pessoa
- Sugira melhorias específicas
- Aprove commits que seguem os padrões

**Para Contribuidores**
- Responda a feedback de forma aberta
- Explique decisões técnicas quando questionado
- Aceite sugestões que melhoram o código
- Mantenha a PR atualizada durante review

## Processo de Release

**Versionamento**
- Segue Semantic Versioning (SemVer)
- MAJOR.MINOR.PATCH
- MAJOR: Mudanças incompatíveis na API
- MINOR: Funcionalidades backward-compatible
- PATCH: Correções de bugs backward-compatible

**Release Checklist**
- [ ] Todos os testes passando
- [ ] Documentação atualizada
- [ ] CHANGELOG.md atualizado
- [ ] Versão atualizada em package.json
- [ ] Tag de versão criada
- [ ] Release notes publicadas

## Recursos e Suporte

**Documentação**
- Leia a documentação existente antes de perguntar
- Consulte ARCHITECTURE.md para entender o sistema
- Verifique CHANGELOG.md para histórico de mudanças

**Comunicação**
- Use issues para bugs e feature requests
- Use discussions para perguntas e ideias
- Seja específico e forneça contexto adequado

**Ferramentas**
- Use linters configurados no projeto
- Siga os padrões de formatação estabelecidos
- Mantenha dependências atualizadas

Ao seguir estas diretrizes, você ajuda a manter a qualidade e consistência do projeto, facilitando a colaboração e garantindo que o código permaneça mantível e escalável.