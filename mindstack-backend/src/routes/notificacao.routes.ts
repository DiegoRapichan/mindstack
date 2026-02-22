import { Router } from "express";
import { NotificacaoController } from "../controllers/NotificacaoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const notificacaoRoutes = Router();

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

export { notificacaoRoutes };
