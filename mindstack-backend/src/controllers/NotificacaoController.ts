import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../lib/prisma";

export class NotificacaoController {
  static async buscarNotificacoes(
    req: AuthRequest,
    res: Response,
  ): Promise<any> {
    try {
      const usuarioId = req.usuarioId!;
      const notificacoes = await prisma.notificacao.findMany({
        where: { usuarioId },
        orderBy: { createdAt: "desc" },
      });
      return res.json(notificacoes);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar notificações." });
    }
  }

  static async marcarComoLida(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const usuarioId = req.usuarioId!;
      const notificacao = await prisma.notificacao.updateMany({
        where: { id: String(id), usuarioId },
        data: { lida: true },
      });
      return res.json({ message: "Notificação lida." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar." });
    }
  }

  static async marcarTodasComoLidas(
    req: AuthRequest,
    res: Response,
  ): Promise<any> {
    try {
      const usuarioId = req.usuarioId!;
      await prisma.notificacao.updateMany({
        where: { usuarioId, lida: false },
        data: { lida: true },
      });
      return res.json({ message: "Todas lidas." });
    } catch (error) {
      return res.status(500).json({ error: "Erro." });
    }
  }
}
