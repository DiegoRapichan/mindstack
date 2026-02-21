import { Router } from "express";
import { ResumoController } from "../controllers/ResumoController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../config/multer";

const resumoRoutes = Router();
const resumoController = new ResumoController();

// Todas as rotas de resumo exigem que o usuário esteja logado
resumoRoutes.use(authMiddleware);

// Rota de upload: Usa o Multer ANTES de chamar o Controller
// "upload.single('arquivoPdf')" diz pro Express: "Espere um único arquivo e o nome do campo será 'arquivoPdf'"
resumoRoutes.post(
  "/upload",
  upload.single("arquivoPdf"),
  resumoController.uploadEGerar,
);

export { resumoRoutes };
