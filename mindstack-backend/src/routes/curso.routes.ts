import { Router } from "express";
import { CursoController } from "../controllers/CursoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const cursoRoutes = Router();

// Protege todas as rotas de cursos com o Token JWT do usuário
cursoRoutes.use(authMiddleware);

// Rota POST: Criar um novo curso
cursoRoutes.post("/", CursoController.create);

// Rota GET: Listar todos os cursos do usuário logado
cursoRoutes.get("/", CursoController.list);

export { cursoRoutes };
