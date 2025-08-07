# Twodo - Frontend

> Interface moderna, responsiva e intuitiva para o sistema de notas Twodo, construída com Angular 19 e Clean Architecture.

## 📖 Sobre o Projeto

O **Twodo Frontend** é a aplicação responsável pela experiência do usuário, consumo da API GraphQL e apresentação das funcionalidades de notas, autenticação, personalização de tema e gerenciamento de arquivos. Toda a arquitetura é baseada nos princípios da **Clean Architecture**, garantindo uma base sólida, modular e escalável.

### 🎯 Objetivo
Prover uma interface clara e eficiente para a organização de ideias, tarefas e documentos, com alta qualidade técnica e ótima experiência de usuário.

---

## 🏗️ Arquitetura

Este frontend segue **rigorosamente** os princípios da **Clean Architecture** de Uncle Bob, com separação clara de responsabilidades entre as camadas da aplicação.

```
🏛️ Clean Architecture Layers
├── 🟢 Entities (Regras de Negócio Corporativas)
├── 🔵 Use Cases & Services (Regras de Aplicação)
├── 🟡 Interface Adapters (Presenters, Containers, Mappers)
└── 🔴 Frameworks & Drivers (Angular, GraphQL, UI, Browser APIs)
```

### Princípios Aplicados
- **Regra da Dependência**: As dependências sempre apontam para dentro
- **Independência de Frameworks**: A lógica de negócio não conhece Angular, GraphQL ou serviços externos
- **Inversão de Dependência**: Serviços são injetados via abstrações
- **Testabilidade Extrema**: Componentes desacoplados e orientados por injeção de dependência

---

## 🛠️ Stack Tecnológica

### Frontend
- **Angular 19** — Framework principal
- **TypeScript** — Strict mode habilitado
- **GraphQL (Apollo)** — Comunicação com backend
- **Ng-Zorro** — Biblioteca de componentes UI baseada em Ant Design
- **SCSS** — Pré-processador de estilos com temas customizados

### Backend
- [**Twodo Backend**](https://github.com/leogrh-dev/twodo-backend) — API construída com NestJS e GraphQL

---

## 📁 Estrutura do Projeto

```
src/
├─ app/
│  ├─ core/                 # Entidades e serviços de domínio
│  ├─ infrastructure/       # Comunicação GraphQL com backend
│  ├─ interface-adapters/   # Presenters e containers (páginas e componentes)
│  ├─ shared/               # Guards e utilitários globais
│  └─ app.routes.ts         # Arquivo de rotas
├─ assets/                  # Imagens, logos e microfrontends
├─ environments/            # Arquivos de ambiente (prod/dev)
├─ styles/                  # Temas, resets e overrides do Ant Design
├─ index.html               # HTML principal
├─ main.ts                  # Entry point da aplicação
└─ theme.less               # Tema customizado para ng-zorro
```

### Organização por Domínio

O projeto é organizado por **domínio funcional**, refletindo o contexto da aplicação. Cada pasta agrupa os arquivos de forma coesa:

- `note/`, `auth/`, `user/` organizados de forma independente
- Componentes e páginas estão separados em `components/` e `containers/`

---

## 🔐 Exemplo de `.env` (Angular)

Variáveis de ambiente ficam em `environment.ts` e `environment.prod.ts`. Exemplo:

```ts
export const environment = {
  production: false,
  graphqlEndpoint: 'http://localhost:3000/graphql',
  googleClientId: 'sua-client-id.apps.googleusercontent.com'
};
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)
- Backend do Twodo rodando ([link](https://github.com/leogrh-dev/twodo-backend))

### Passos

```bash
# Instale as dependências
npm install

# Rode o frontend
ng serve
```

Acesse: `http://localhost:4200`

---

## 📈 Status do Desenvolvimento

🔄 **Em Desenvolvimento Ativo**

### Próximas Funcionalidades:
- [ ] Editor de texto rico com formatação
- [ ] Drag & Drop entre notas
- [ ] Modo escuro automático por sistema
- [ ] Organização por workspaces
- [ ] Colaboração em tempo real

---

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch (`git checkout -b FEAT/nova-funcionalidade`)
3. Commit suas alterações (`git commit -m 'FEAT: nova funcionalidade'`)
4. Push na sua branch (`git push origin FEAT/nova-funcionalidade`)
5. Abra um Pull Request

### 📋 Diretrizes de Contribuição:
- Seguir **rigorosamente a Clean Architecture**
- Não acoplar lógica de negócio a componentes Angular
- Reutilizar services do domínio em múltiplos contexts
- Componentes devem ser desacoplados e testáveis

---

## 👥 Autor

Desenvolvido por Leonardo Gabriel Reis Henrique

---

**Twodo Frontend** — produtividade com arquitetura de verdade.