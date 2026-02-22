"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioRoutes = void 0;
const express_1 = require("express");
const UsuarioController_1 = require("../controllers/UsuarioController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const usuarioRoutes = (0, express_1.Router)();
exports.usuarioRoutes = usuarioRoutes;
const usuarioController = new UsuarioController_1.UsuarioController();
usuarioRoutes.post("/register", usuarioController.register);
usuarioRoutes.post("/login", usuarioController.login);
usuarioRoutes.put("/perfil", authMiddleware_1.authMiddleware, UsuarioController_1.UsuarioController.atualizarPerfil);
//# sourceMappingURL=usuario.routes.js.map