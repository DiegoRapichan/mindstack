import { Router } from "express";
import multer from "multer";
import { ResumoController } from "../controllers/ResumoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const resumoRoutes = Router();

const upload = multer({ storage: multer.memoryStorage() });

resumoRoutes.use(authMiddleware);

resumoRoutes.post("/", upload.single("pdf"), ResumoController.create);

export { resumoRoutes };
