"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tarefaRoutes = void 0;
const express_1 = require("express");
const TarefaController_1 = require("../controllers/TarefaController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const tarefaRoutes = (0, express_1.Router)();
exports.tarefaRoutes = tarefaRoutes;
// Todas as rotas de tarefas exigem autenticação
tarefaRoutes.use(authMiddleware_1.authMiddleware);
tarefaRoutes.post("/", TarefaController_1.TarefaController.criar);
tarefaRoutes.get("/", TarefaController_1.TarefaController.listar);
tarefaRoutes.put("/reordenar", TarefaController_1.TarefaController.reordenar);
tarefaRoutes.put("/:id", TarefaController_1.TarefaController.atualizar);
tarefaRoutes.delete("/:id", TarefaController_1.TarefaController.excluir);
//# sourceMappingURL=tarefa.routes.js.map