import { Router } from "express";
import { NotificacaoController } from "../controllers/NotificacaoController";

import { authMiddleware } from "../middlewares/middlewares/auth";

export const notificacaoRoutes = Router();

notificacaoRoutes.get(
  "/",
  authMiddleware,
  NotificacaoController.buscarNotificacoes,
);
notificacaoRoutes.patch(
  "/ler-todas",
  authMiddleware,
  NotificacaoController.marcarTodasComoLidas,
);
notificacaoRoutes.patch(
  "/:id/lida",
  authMiddleware,
  NotificacaoController.marcarComoLida,
);
