import { Router } from "express";
import multer from "multer";
import { ResumoController } from "../controllers/ResumoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const resumoRoutes = Router();

// MUDANÇA CRUCIAL AQUI: Usando memória RAM para o file.buffer funcionar!
const upload = multer({ storage: multer.memoryStorage() });

resumoRoutes.use(authMiddleware);

resumoRoutes.post("/", upload.single("pdf"), ResumoController.create);
resumoRoutes.get("/cursos/:cursoId", ResumoController.listarPorCurso);

export { resumoRoutes };
