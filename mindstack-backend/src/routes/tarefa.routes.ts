import { Router } from "express";
import { TarefaController } from "../controllers/TarefaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const tarefaRoutes = Router();

// Todas as rotas de tarefas exigem autenticação
tarefaRoutes.use(authMiddleware);

tarefaRoutes.post("/", TarefaController.criar);
tarefaRoutes.get("/", TarefaController.listar);
tarefaRoutes.put("/reordenar", TarefaController.reordenar);
tarefaRoutes.put("/:id", TarefaController.atualizar);
tarefaRoutes.delete("/:id", TarefaController.excluir);

export { tarefaRoutes };
