import { Router } from "express";
import { CursoController } from "../controllers/CursoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const cursoRoutes = Router();
const cursoController = new CursoController();

// AQUI ESTÁ A MÁGICA:
// Passamos o authMiddleware ANTES do controller.
// Se o cara não mandar o Token, o Express barra ele aqui mesmo e nem chega no CursoController.
cursoRoutes.use(authMiddleware);

// Rotas protegidas
cursoRoutes.post("/", cursoController.create); // POST /cursos
cursoRoutes.get("/", cursoController.list); // GET /cursos

export { cursoRoutes };
