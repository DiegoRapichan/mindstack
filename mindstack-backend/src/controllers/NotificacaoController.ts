import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const NotificacaoController = {
  // 1. Buscar notificações do usuário logado
  async buscarNotificacoes(req: Request, res: Response) {
    try {
      // Pega o ID do usuário injetado pelo seu middleware de JWT
      const usuarioId = req.userId; // ou req.usuario.id (ajuste para o seu padrão)

      if (!usuarioId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const notificacoes = await prisma.notificacao.findMany({
        where: {
          usuarioId: usuarioId,
        },
        orderBy: {
          createdAt: "desc", // As mais recentes primeiro
        },
      });

      return res.status(200).json(notificacoes);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  // 2. Marcar uma notificação específica como lida
  async marcarComoLida(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const notificacaoAtualizada = await prisma.notificacao.update({
        where: { id: id },
        data: { lida: true },
      });

      return res.status(200).json(notificacaoAtualizada);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  // 3. (Bônus) Marcar TODAS como lidas de uma vez
  async marcarTodasComoLidas(req: Request, res: Response) {
    try {
      const usuarioId = req.userId; // ajuste conforme seu JWT

      await prisma.notificacao.updateMany({
        where: {
          usuarioId: usuarioId,
          lida: false,
        },
        data: { lida: true },
      });

      return res
        .status(200)
        .json({ message: "Todas as notificações marcadas como lidas" });
    } catch (error) {
      console.error("Erro ao limpar notificações:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  },
};
