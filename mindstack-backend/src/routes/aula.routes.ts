import { Router } from "express";
import { AulaController } from "../controllers/AulaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const aulaRoutes = Router();

aulaRoutes.use(authMiddleware);

aulaRoutes.post("/", AulaController.create);
aulaRoutes.get("/disciplina/:disciplinaId", AulaController.listarPorDisciplina);
aulaRoutes.patch("/:aulaId/status", AulaController.atualizarStatus);

export { aulaRoutes };
