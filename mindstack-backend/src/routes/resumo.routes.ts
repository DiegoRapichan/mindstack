import { Router } from "express";
import multer from "multer";
import { ResumoController } from "../controllers/ResumoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const resumoRoutes = Router();

// Configuração do multer (para receber o arquivo PDF na memória RAM)
const upload = multer({ storage: multer.memoryStorage() });

// Segurança: usuário precisa estar logado
resumoRoutes.use(authMiddleware);

// Rota para fazer upload do PDF e gerar o resumo com IA
resumoRoutes.post("/", upload.single("pdf"), ResumoController.create);

export { resumoRoutes };
