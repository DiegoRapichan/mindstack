# 🧠 Mindstack - Plataforma Inteligente de Gestão de Estudos

> **Transformando a organização acadêmica com Inteligência Artificial.**
> O Mindstack é um ecossistema completo que vai muito além de um "To-Do List". Ele une a organização estruturada de cursos e um sistema Kanban de tarefas com o poder da **Inteligência Artificial**, capaz de ler PDFs extensos e gerar resumos automáticos para otimizar o tempo do estudante.

[![Deploy Frontend](https://img.shields.io/badge/Vercel-Online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mindstack-sigma.vercel.app)
[![Deploy Backend](https://img.shields.io/badge/Render-API_Online-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://mindstack-api-cdy3.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)]()
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()

🔗 **[Acessar a Aplicação ao Vivo](https://mindstack-sigma.vercel.app)**

---

## 🌟 O Grande Diferencial (Valor do Projeto)

Este projeto foi desenvolvido para demonstrar domínio no ciclo completo de desenvolvimento de software (Full Cycle) e na resolução de problemas reais, aplicando tecnologias modernas:

- 🤖 **Motor de Resumos com IA (Google Gemini):** Pipeline no backend que recebe uploads de arquivos PDF, realiza extração de texto (parsing) e consome a API do Google Generative AI para entregar resumos estruturados e inteligentes.
- ☁️ **Arquitetura Cloud & Serverless:** Sistema totalmente em produção. Banco de dados relacional Serverless (**Neon**), API REST hospedada no **Render** e Frontend distribuído pela **Vercel**.
- 📋 **Gestão Visual com Kanban:** Interface dinâmica para gerenciamento de tarefas e progresso, proporcionando uma excelente Experiência do Usuário (UX).
- 🔐 **Segurança e Autenticação:** Sistema sólido de rotas privadas, autenticação baseada em **JWT** (JSON Web Tokens) e senhas criptografadas (Bcryptjs).

---

## 📸 Espiadinha no Sistema

<p align="center">
  <img src="screenshots/dashboard-claro.png" width="49%" alt="Dashboard em Light Mode">
  <img src="screenshots/dashboard-escuro.png" width="49%" alt="Dashboard em Dark Mode">
</p>

<p align="center">
  <img src="screenshots/resumo.png" width="49%" alt="Geração de Resumos com IA (Google Gemini)">
  <img src="screenshots/kanban.png" width="49%" alt="Gestão de Tarefas via Kanban">
</p>

---

## ✨ Funcionalidades Principais

### 🧠 Assistente de Inteligência Artificial

- Upload de materiais em PDF (artigos, slides, e-books).
- Processamento e extração de texto no servidor.
- Geração de resumos automáticos focados nos pontos-chave via integração com IA.

### 📚 Gestão Acadêmica & Produtividade

- Cadastro e organização hierárquica: **Cursos ➔ Disciplinas ➔ Aulas**.
- Quadro Kanban interativo para controle de status de tarefas (Pendente, Em Andamento, Concluída).
- Dashboard analítico com visão geral do progresso do usuário.

### 🎨 Experiência do Usuário (UX/UI)

- Interface moderna, limpa e totalmente responsiva.
- Suporte nativo a **Dark Mode e Light Mode** integrado ao Context API do React.
- Notificações visuais de feedback para o usuário.

---

## 🛠️ Tecnologias e Ferramentas

### Backend (API REST)

- **Node.js & Express:** Servidor web rápido e escalável.
- **TypeScript:** Tipagem estática rigorosa (`verbatimModuleSyntax` habilitado).
- **Prisma ORM:** Modelagem de banco de dados e controle de migrações.
- **PostgreSQL:** Banco de dados relacional hospedado na nuvem (Neon).
- **Google Generative AI:** Integração com IA para processamento de linguagem natural.
- **Multer & PDF-Parse:** Manipulação de _file uploads_ e extração de texto.

### Frontend (SPA)

- **React 18 & Vite:** Interface ultrarrápida e build otimizado.
- **TypeScript:** Garantindo a integridade dos dados consumidos da API.
- **Tailwind CSS:** Estilização utilitária e design system.
- **Axios:** Cliente HTTP com _interceptors_ para injeção automática de tokens JWT.
- **React Router DOM:** Navegação fluida de Single Page Application.

---

## 🚀 Estrutura do Monorepo

O projeto foi estruturado em um único repositório para centralizar o código, mantendo uma separação clara de responsabilidades entre cliente e servidor:

```text
mindstack/
├── mindstack-backend/       # API Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Regras de resposta HTTP
│   │   ├── lib/             # Instância do Prisma DB
│   │   ├── middlewares/     # Interceptadores (Auth JWT, Uploads)
│   │   ├── routes/          # Endpoints da API
│   │   └── services/        # Regras de negócio complexas (AiService)
│   └── prisma/              # Schema do banco de dados
│
└── mindstack-frontend/      # Aplicação React SPA
    ├── src/
    │   ├── components/      # UI isolada (Kanban, Cards, Modais)
    │   ├── contexts/        # Estado global (Auth, Theme)
    │   ├── pages/           # Telas da aplicação
    │   └── services/        # Integração via Axios⚙️ Como Executar LocalmentePré-requisitos
Node.js (v18+)
PostgreSQL
Chave de API do Google Gemini (Gratuita)
1. Clonando o Repositóriobash12git clone https://github.com/DiegoRapichan/mindstack.git
cd mindstackgit clone https://github.com/DiegoRapichan/mindstack.git
cd mindstack2. Configurando o Backendbash12345678910111213cd mindstack-backend
npm install

# Crie um arquivo .env na raiz do backend copiando o .env.example:
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/mindstack"
# JWT_SECRET="seu_segredo_super_seguro"
# GEMINI_API_KEY="sua_chave_do_google"

# Execute as migrations para criar as tabelas
npx prisma db push

# Inicie o servidor em modo de desenvolvimento
npm run devcd mindstack-backend
npm install

# Crie um arquivo .env na raiz do backend copiando o .env.example:
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/mindstack"
# JWT_SECRET="seu_segredo_super_seguro"
# GEMINI_API_KEY="sua_chave_do_google"

# Execute as migrations para criar as tabelas
npx prisma db push

# Inicie o servidor em modo de desenvolvimento
npm run dev3. Configurando o FrontendAbra um novo terminal na raiz do projeto:bash12345cd mindstack-frontend
npm install

# Inicie a aplicação Vite
npm run devcd mindstack-frontend
npm install

# Inicie a aplicação Vite
npm run devO Frontend estará acessível em http://localhost:5173.👨‍💻 AutorDiego Rapichan
Desenvolvedor focado em criar soluções que unem código limpo, arquitetura sólida e integrações inteligentes.💼 LinkedIn: Diego Rapichan
💻 GitHub: @DiegoRapichan
✉️ Email: direrapichan@gmail.comSe este projeto ou a integração com Inteligência Artificial te inspirou, considere deixar uma ⭐ no repositório!
```
