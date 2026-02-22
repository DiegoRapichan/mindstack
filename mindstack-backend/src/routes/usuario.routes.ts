import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

usuarioRoutes.post("/register", usuarioController.register);
usuarioRoutes.post("/login", usuarioController.login);
usuarioRoutes.put("/perfil", authMiddleware, UsuarioController.atualizarPerfil);

export { usuarioRoutes };
