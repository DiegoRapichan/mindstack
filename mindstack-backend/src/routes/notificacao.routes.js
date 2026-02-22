"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificacaoRoutes = void 0;
const express_1 = require("express");
const NotificacaoController_1 = require("../controllers/NotificacaoController");
const auth_1 = require("../middlewares/middlewares/auth");
exports.notificacaoRoutes = (0, express_1.Router)();
exports.notificacaoRoutes.get("/", auth_1.authMiddleware, NotificacaoController_1.NotificacaoController.buscarNotificacoes);
exports.notificacaoRoutes.patch("/ler-todas", auth_1.authMiddleware, NotificacaoController_1.NotificacaoController.marcarTodasComoLidas);
exports.notificacaoRoutes.patch("/:id/lida", auth_1.authMiddleware, NotificacaoController_1.NotificacaoController.marcarComoLida);
//# sourceMappingURL=notificacao.routes.js.map