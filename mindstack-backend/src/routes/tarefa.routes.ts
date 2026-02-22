import { Router } from "express";
import { TarefaController } from "../controllers/TarefaController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const tarefaRoutes = Router();

tarefaRoutes.get("/", authMiddleware, TarefaController.listar);
tarefaRoutes.post("/", authMiddleware, TarefaController.criar);
tarefaRoutes.put("/reordenar", TarefaController.reordenar);
tarefaRoutes.patch(
  "/:id/status",
  authMiddleware,
  TarefaController.atualizarStatus,
);
tarefaRoutes.delete("/:id", authMiddleware, TarefaController.excluir);
tarefaRoutes.put("/:id", authMiddleware, TarefaController.atualizar);
