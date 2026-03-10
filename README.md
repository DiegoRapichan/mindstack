# MindStack — Plataforma Inteligente de Gestão de Estudos

> **Transformando a organização acadêmica com Inteligência Artificial.**
> O MindStack é um ecossistema completo que vai muito além de um "To-Do List". Ele une a organização estruturada de cursos e um sistema Kanban de tarefas com o poder da **Inteligência Artificial**, capaz de ler PDFs extensos e gerar resumos automáticos para otimizar o tempo do estudante.
>
> Plataforma full-stack de gestão acadêmica com pipeline de IA integrado — processa PDFs em memória, aplica prompt engineering sobre o Google Gemini para gerar resumos estruturados, e gerencia cursos, disciplinas, aulas, frequência e tarefas com Kanban drag-and-drop.

[![Deploy Frontend](https://img.shields.io/badge/Vercel-Online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mindstack-sigma.vercel.app)
[![Deploy Backend](https://img.shields.io/badge/Render-API_Online-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://mindstack-api-cdy3.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)]()
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_18-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat&logo=google&logoColor=white)

**[App ao Vivo](https://mindstack-sigma.vercel.app)** • **[API em Produção](https://mindstack-api-cdy3.onrender.com)**

---

## O Projeto

Este projeto foi desenvolvido para demonstrar domínio no ciclo completo de desenvolvimento de software (Full Cycle) e na resolução de problemas reais, aplicando tecnologias modernas:

- **Motor de Resumos com IA (Google Gemini):** Pipeline no backend que recebe uploads de arquivos PDF, realiza extração de texto (parsing) e consome a API do Google Generative AI para entregar resumos estruturados e inteligentes.
- **Arquitetura Cloud & Serverless:** Sistema totalmente em produção. Banco de dados relacional Serverless (**Neon**), API REST hospedada no **Render** e Frontend distribuído pela **Vercel**.
- **Gestão Visual com Kanban:** Interface dinâmica para gerenciamento de tarefas e progresso, proporcionando uma excelente Experiência do Usuário (UX).
- **Segurança e Autenticação:** Sistema sólido de rotas privadas, autenticação baseada em **JWT** (JSON Web Tokens) e senhas criptografadas (Bcryptjs).

---

## Screenshots

<p align="center">
  <img src="screenshots/dashboard-claro.png" width="49%" alt="Dashboard em Light Mode">
  <img src="screenshots/dashboard-escuro.png" width="49%" alt="Dashboard em Dark Mode">
</p>

<p align="center">
  <img src="screenshots/resumo.png" width="49%" alt="Geração de Resumos com IA (Google Gemini)">
  <img src="screenshots/kanban.png" width="49%" alt="Gestão de Tarefas via Kanban">
</p>

---

## Stack

| Camada       | Tecnologias                                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Backend**  | Node.js 18 · TypeScript · Express · Prisma ORM · PostgreSQL (Neon) · JWT · Bcryptjs · Nodemailer · pdf2json · Multer |
| **IA**       | Google Generative AI SDK (`gemini-flash-latest`) · Prompt Engineering                                                 |
| **Frontend** | React 18 · TypeScript · Vite · Tailwind CSS · Axios · React Router DOM · Context API                                 |
| **Deploy**   | Render (backend) · Vercel (frontend) · Neon (PostgreSQL serverless)                                                   |

---

## Destaques Técnicos

**Pipeline de IA com processamento em memória**
PDF recebido via Multer é parseado com `pdf2json` diretamente do buffer — sem escrita em disco. O texto extraído passa por limpeza de caracteres (`\r\n`) antes de ser enviado ao Gemini. O resumo gerado é persistido no banco vinculado à disciplina e aula correspondentes, com o tamanho do texto original salvo como metadado.

**Prompt engineering estruturado**
O prompt define persona (professor universitário e mentor de carreira), formato de saída (Markdown com títulos, bullets e negritos), instrução específica para tratar trechos de código diferente de texto corrido, e uma seção obrigatória "Insight de Sinergia" conectando o conteúdo ao mercado de trabalho. Não é uma chamada genérica de API — é um prompt com estrutura deliberada para maximizar a utilidade do output.

**Tarefas recorrentes com auto-replicação transacional**
Ao reordenar o Kanban e mover uma tarefa `recorrente: true` para `DONE`, o sistema detecta a transição de status, cria automaticamente uma cópia da tarefa com status `TODO` e data de entrega deslocada 7 dias, e executa tudo dentro de um `prisma.$transaction` — garantindo que a atualização e a criação sejam atômicas.

**TypeScript end-to-end com interface customizada**
`AuthRequest extends Request` propaga o `usuarioId` extraído do JWT por toda a cadeia de controllers de forma type-safe, sem casting manual em cada handler. Tipagem estrita no frontend garante integridade dos dados consumidos da API.

**Autenticação com isolamento completo por usuário**
Todos os recursos (cursos, disciplinas, aulas, tarefas, notificações, resumos) são filtrados por `usuarioId` em todas as queries. Senha retorna com destructuring explícito antes de qualquer resposta ao cliente — a hash nunca trafega pela API.

**Hierarquia de dados relacional completa**
`Usuário → Cursos → Disciplinas → Aulas → Resumos` com relacionamentos FK, `include` aninhado nas queries (aulas já chegam com resumos), e controle de frequência por status (`PENDENTE`, `PRESENTE`, `FALTA`, `ASSISTIDA_GRAVADA`) com limite de faltas configurável por disciplina.

**Notificações persistidas com Cron Job**
Cron Job executa diariamente às 6h verificando tarefas vencidas e gerando notificações no banco. O frontend consulta via polling e exibe com suporte a marcar como lida individualmente ou em lote.

**Envio de e-mail via Nodemailer + Gmail SMTP**
Formulário de contato envia e-mail real com `replyTo` configurado para o remetente, permitindo resposta direta sem expor o endereço do servidor.

**Dark/Light mode nativo via Context API**
Tema gerenciado globalmente sem biblioteca externa de state management, com transições CSS e persistência local.

---

## Pipeline de IA — Fluxo Completo

```
Frontend (React)
    │
    │  POST /api/resumos (multipart/form-data)
    │  { pdf: File, disciplinaId, aulaId? }
    ▼
Multer Middleware
    │  recebe arquivo, mantém em memória (buffer)
    ▼
pdf2json
    │  parseia buffer → extrai texto bruto
    │  limpa quebras de linha (\r\n → espaço)
    ▼
AiService.gerarResumo(textoCru)
    │  monta prompt com persona + formato Markdown
    │  + instrução para código + "Insight de Sinergia"
    │  envia para gemini-flash-latest
    ▼
Prisma → resumo.create()
    │  persiste { conteudo, tamanhoOriginal, disciplinaId, aulaId }
    ▼
Resposta JSON → frontend renderiza resumo Markdown
```

---

## Modelo de Dados (Prisma)

```
Usuario
  ├── Curso[] (plataforma, tipo, status)
  │     └── Disciplina[] (professor, maxFaltasPermitidas)
  │           ├── Aula[] (dataHora, linkVideo, status: PENDENTE|PRESENTE|FALTA|ASSISTIDA_GRAVADA)
  │           │     └── Resumo[] (conteudo, tamanhoOriginal)
  │           └── Tarefa[] (status, ordem, dataEntrega, recorrente)
  └── Notificacao[] (mensagem, lida)
```

---

## Funcionalidades

**IA e Processamento de Documentos**
- Upload e parsing de PDFs em memória (sem armazenamento em disco)
- Geração de resumos estruturados em Markdown via Google Gemini
- Resumos vinculados à disciplina e aula específica
- Visualização do resumo gerado diretamente na interface da aula

**Gestão Acadêmica**
- Hierarquia completa: Cursos → Disciplinas → Aulas
- Controle de frequência por aula (Presente / Falta / Gravada)
- Limite de faltas configurável por disciplina com alerta visual
- Links de videoaula (Zoom/Meet) por aula

**Kanban e Tarefas**
- Board Kanban com drag-and-drop (TODO / IN PROGRESS / DONE)
- Reordenação persistida no banco via campo `ordem`
- Tarefas recorrentes com auto-replicação ao concluir
- Vínculo de tarefas a disciplinas específicas

**Notificações**
- Cron Job diário às 6h verificando pendências
- Marcar notificação como lida individualmente ou em lote

**Conta e Segurança**
- Registro e login com JWT (7 dias de expiração)
- Atualização de perfil com validação de senha atual
- Hash bcrypt com salt 10 — senha nunca retorna na API

---

## Estrutura do Projeto

```
mindstack/
├── mindstack-backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── controllers/
│       │   ├── AulaController.ts        # CRUD + status de frequência
│       │   ├── CursoController.ts
│       │   ├── DisciplinaController.ts
│       │   ├── NotificacaoController.ts # marcar lida / em lote
│       │   ├── ResumoController.ts      # pipeline PDF → Gemini
│       │   ├── TarefaController.ts      # Kanban + recorrentes
│       │   ├── UsuarioController.ts     # auth + perfil
│       │   └── ContatoController.ts     # Nodemailer SMTP
│       ├── services/
│       │   └── AiService.ts             # Google Gemini + prompt engineering
│       ├── middlewares/
│       │   └── authMiddleware.ts        # JWT → AuthRequest
│       └── lib/
│           └── prisma.ts                # instância Prisma singleton
│
└── mindstack-frontend/
    └── src/
        ├── pages/
        │   ├── Dashboard.tsx
        │   ├── Kanban.tsx               # drag-and-drop
        │   ├── CursoDetalhe.tsx
        │   ├── DisciplinaDetalhe.tsx    # upload PDF + visualização resumo
        │   ├── Login.tsx
        │   └── Configuracoes.tsx
        ├── contexts/
        │   ├── AuthContext.tsx
        │   └── ThemeContext.tsx          # dark/light mode
        └── services/
            └── api.ts                   # Axios + interceptors JWT
```

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js 18+, PostgreSQL ou conta no [Neon](https://neon.tech) (gratuito), chave da [Google Gemini API](https://aistudio.google.com) (gratuita)

```bash
# 1. Clone
git clone https://github.com/DiegoRapichan/mindstack.git
cd mindstack

# 2. Backend
cd mindstack-backend
npm install

# Configure o .env
DATABASE_URL="postgresql://usuario:senha@host:5432/mindstack"
JWT_SECRET="seu_segredo_seguro"
GEMINI_API_KEY="sua_chave_gemini"
EMAIL_USER="seu@gmail.com"
EMAIL_PASS="sua_senha_de_app_gmail"

npx prisma db push   # cria as tabelas
npm run dev          # API em http://localhost:3000

# 3. Frontend (novo terminal)
cd ../mindstack-frontend
npm install
npm run dev          # App em http://localhost:5173
```

---

## Deploy

| Serviço        | URL                                      |
| -------------- | ---------------------------------------- |
| Frontend       | https://mindstack-sigma.vercel.app       |
| Backend API    | https://mindstack-api-cdy3.onrender.com  |
| Banco de dados | Neon (PostgreSQL serverless)             |

---

## Autor

**Diego Rapichan** — Desenvolvedor Full Stack · Node.js/TypeScript + React

[![LinkedIn](https://img.shields.io/badge/LinkedIn-diego--rapichan-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/diegorapichan)
[![GitHub](https://img.shields.io/badge/GitHub-DiegoRapichan-181717?style=flat&logo=github)](https://github.com/DiegoRapichan)

📍 Apucarana, Paraná — Brasil

---

📄 Licença MIT
