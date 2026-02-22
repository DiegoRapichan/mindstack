import "dotenv/config";
import express from "express";
import cors from "cors";

import { usuarioRoutes } from "./routes/usuario.routes";
import { cursoRoutes } from "./routes/curso.routes";
import { resumoRoutes } from "./routes/resumo.routes";
import { disciplinaRoutes } from "./routes/disciplina.routes";
import { aulaRoutes } from "./routes/aula.routes";
import { tarefaRoutes } from "./routes/tarefa.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { ContatoController } from "./controllers/ContatoController";

import { iniciarCronJobs } from "./jobs/lembretesAulas.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/contato", ContatoController.enviar);

app.use("/auth", usuarioRoutes);
app.use("/cursos", cursoRoutes);
app.use("/disciplinas", disciplinaRoutes);
app.use("/aulas", aulaRoutes);
app.use("/resumos", resumoRoutes);
app.use("/tarefas", tarefaRoutes);
app.use("/dashboard", dashboardRoutes);

iniciarCronJobs();

app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    message: "Servidor do Mindstack rodando! 🚀",
  });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () =>
  console.log(`🔥 Mindstack Backend rodando na porta ${PORT}`),
);
