import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";

const dashboardRoutes = Router();

// Protege a rota com o middleware de autenticação
dashboardRoutes.use(authMiddleware);

// Rota principal do dashboard
dashboardRoutes.get("/", DashboardController.getResumo);

export { dashboardRoutes };
