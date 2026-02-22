import { Router } from "express";
import { DisciplinaController } from "../controllers/DisciplinaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const disciplinaRoutes = Router();

// Protege todas as rotas com o Token JWT
disciplinaRoutes.use(authMiddleware);

// Rota para criar matéria: POST /disciplinas
disciplinaRoutes.post("/", DisciplinaController.create);

// Rota para listar matérias de um curso: GET /disciplinas/curso/:cursoId
disciplinaRoutes.get("/curso/:cursoId", DisciplinaController.listarPorCurso);

export { disciplinaRoutes };
