import { Router } from "express";
import { DisciplinaController } from "../controllers/DisciplinaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const disciplinaRoutes = Router();

disciplinaRoutes.use(authMiddleware);

disciplinaRoutes.get("/", DisciplinaController.listarTodas);

disciplinaRoutes.post("/", DisciplinaController.create);
disciplinaRoutes.get("/curso/:cursoId", DisciplinaController.listarPorCurso);

export { disciplinaRoutes };
