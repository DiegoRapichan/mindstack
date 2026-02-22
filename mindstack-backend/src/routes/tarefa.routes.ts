import { Router } from "express";
import { TarefaController } from "../controllers/TarefaController";
import { authMiddleware } from "../middlewares/authMiddleware"; // Ajuste o caminho

export const tarefaRoutes = Router();

tarefaRoutes.get("/", authMiddleware, TarefaController.listar);
tarefaRoutes.post("/", authMiddleware, TarefaController.criar);
tarefaRoutes.patch(
  "/:id/status",
  authMiddleware,
  TarefaController.atualizarStatus,
);
