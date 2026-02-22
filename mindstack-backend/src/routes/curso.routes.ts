import { Router } from "express";
import { CursoController } from "../controllers/CursoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const cursoRoutes = Router();

cursoRoutes.use(authMiddleware);

cursoRoutes.post("/", CursoController.create);

cursoRoutes.get("/", CursoController.list);

export { cursoRoutes };
