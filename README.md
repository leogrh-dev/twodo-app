# Twodo

> Um web app de notas moderno e intuitivo inspirado no Notion, construído com foco em produtividade e organização.

## 📖 Sobre o Projeto

O **Twodo** é uma aplicação web para criação e gerenciamento de notas que combina simplicidade e funcionalidade. Desenvolvido seguindo rigorosamente os princípios da **Clean Architecture** do Uncle Bob, o projeto prioriza manutenibilidade, testabilidade e escalabilidade.

### 🎯 Objetivo
Criar uma ferramenta de produtividade que permita aos usuários organizar suas ideias, tarefas e conhecimentos de forma eficiente e intuitiva.

## 🏗️ Arquitetura

Este projeto adota a **Clean Architecture** como padrão arquitetural fundamental, organizando o código em camadas bem definidas:

```
🏛️ Clean Architecture Layers
├── 🟢 Entities (Regras de Negócio Corporativas)
├── 🔵 Use Cases (Regras de Negócio da Aplicação)  
├── 🟡 Interface Adapters (Controladores, Presenters, Gateways)
└── 🔴 Frameworks & Drivers (UI, Database, Web, Devices)
```

### Princípios Seguidos:
- **Regra da Dependência**: Camadas internas não conhecem camadas externas
- **Inversão de Controle**: Dependências apontam para abstrações
- **Separação de Responsabilidades**: Cada camada tem um propósito específico
- **Independência de Frameworks**: Lógica de negócio isolada de tecnologias

## 🛠️ Stack Tecnológica

### Frontend
- **Angular 19** - Framework principal
- **TypeScript** (strict mode) - Linguagem de desenvolvimento
- **GraphQL** - Comunicação com API

### Backend  
- **NestJS** - Framework Node.js
- **MongoDB** - Base de dados NoSQL
- **GraphQL** - API layer

### Ferramentas
- **GitHub** - Versionamento de código
- **Multirepo** - Frontend e backend separados

## 📁 Estrutura do Projeto

O projeto segue uma organização **multirepo** para melhor isolamento e manutenibilidade:

```
twodo/
├── 📱 twodo-frontend/     # Aplicação Angular
├── 🔧 twodo-backend/      # API NestJS
└── 📚 docs/              # Documentação do projeto
```

### Organização por Domínio
Cada repositório é estruturado por **feature/domínio**, não por tipo de arquivo, facilitando a manutenção e compreensão do código.

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18+)
- npm ou yarn
- MongoDB (local ou remoto)

### Frontend (Angular)
```bash
cd twodo-frontend
npm install
ng serve
```
Acesse: `http://localhost:4200`

### Backend (NestJS)
```bash
cd twodo-backend
npm install
npm run start:dev
```
API disponível em: `http://localhost:3000/graphql`

## 🧪 Testes

O projeto mantém alta cobertura de testes, especialmente nos **Use Cases**:

```bash
# Frontend
ng test

# Backend
npm run test
npm run test:e2e
```

## 📈 Status do Desenvolvimento

🔄 **Em Desenvolvimento Ativo**

### Próximas Funcionalidades:
- [ ] Sistema de autenticação
- [ ] Editor de texto rico
- [ ] Organização por workspaces
- [ ] Colaboração em tempo real
- [ ] Busca avançada

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### 📋 Diretrizes de Desenvolvimento:
- Seguir rigorosamente a Clean Architecture
- Escrever testes para todos os Use Cases
- Manter TypeScript em strict mode
- Documentar decisões arquiteturais importantes

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

Desenvolvido por Leonardo Gabriel Reis Henrique

---

**Twodo** - Organize suas ideias, potencialize sua produtividade.