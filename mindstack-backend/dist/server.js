"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const usuario_routes_1 = require("./routes/usuario.routes");
const curso_routes_1 = require("./routes/curso.routes");
const resumo_routes_1 = require("./routes/resumo.routes");
const disciplina_routes_1 = require("./routes/disciplina.routes");
const aula_routes_1 = require("./routes/aula.routes");
const tarefa_routes_1 = require("./routes/tarefa.routes");
const dashboard_routes_1 = require("./routes/dashboard.routes");
const ContatoController_1 = require("./controllers/ContatoController");
const lembretesAulas_1 = require("./jobs/lembretesAulas");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/contato", ContatoController_1.ContatoController.enviar);
app.use("/auth", usuario_routes_1.usuarioRoutes);
app.use("/cursos", curso_routes_1.cursoRoutes);
app.use("/disciplinas", disciplina_routes_1.disciplinaRoutes);
app.use("/aulas", aula_routes_1.aulaRoutes);
app.use("/resumos", resumo_routes_1.resumoRoutes);
app.use("/tarefas", tarefa_routes_1.tarefaRoutes);
app.use("/dashboard", dashboard_routes_1.dashboardRoutes);
(0, lembretesAulas_1.iniciarCronJobs)();
app.get("/health", (req, res) => {
    return res.json({
        status: "ok",
        message: "Servidor do Mindstack rodando! 🚀",
    });
});
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
