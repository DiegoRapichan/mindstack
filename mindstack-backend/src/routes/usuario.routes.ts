import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

// Configura os endpoints POST
usuarioRoutes.post("/register", usuarioController.register);
usuarioRoutes.post("/login", usuarioController.login);

export { usuarioRoutes };
