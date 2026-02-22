import { Router } from "express";
import { AulaController } from "../controllers/AulaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const aulaRoutes = Router();

// Segurança em primeiro lugar
aulaRoutes.use(authMiddleware);

aulaRoutes.post("/", AulaController.create);
aulaRoutes.get("/disciplina/:disciplinaId", AulaController.listarPorDisciplina);
aulaRoutes.patch("/:aulaId/status", AulaController.atualizarStatus); // Rota exclusiva para bater o ponto (Falta/Presença)

export { aulaRoutes };
