import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

export const TarefaController = {
  async listar(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.usuarioId;
      if (!usuarioId)
        return res.status(401).json({ error: "Usuário não autenticado." });

      const tarefas = await prisma.tarefa.findMany({
        where: { usuarioId },
        include: {
          disciplina: { select: { nome: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(tarefas);
    } catch (error) {
      console.error("❌ Erro no listar tarefas:", error);
      return res.status(500).json({ error: "Erro ao buscar tarefas." });
    }
  },

  async criar(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.usuarioId;
      const { titulo, descricao, status, disciplinaId, dataEntrega } = req.body;

      if (!usuarioId)
        return res.status(401).json({ error: "Usuário não autenticado." });

      const novaTarefa = await prisma.tarefa.create({
        data: {
          titulo,
          descricao,
          status: status || "TODO",
          usuarioId,
          disciplinaId,
          dataEntrega: dataEntrega ? new Date(dataEntrega) : null,
        },
      });

      return res.status(201).json(novaTarefa);
    } catch (error) {
      console.error("❌ Erro ao criar tarefa:", error);
      return res.status(500).json({ error: "Erro ao criar tarefa." });
    }
  },

  async atualizarStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const tarefaAtualizada = await prisma.tarefa.update({
        where: { id },
        data: { status },
      });

      return res.status(200).json(tarefaAtualizada);
    } catch (error) {
      console.error("❌ Erro ao mover a tarefa:", error);
      return res.status(500).json({ error: "Erro ao mover a tarefa." });
    }
  },

  async excluir(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.tarefa.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error("❌ Erro ao excluir tarefa:", error);
      return res.status(500).json({ error: "Erro ao excluir tarefa." });
    }
  },

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { titulo, descricao, disciplinaId, dataEntrega } = req.body;

      const tarefaEditada = await prisma.tarefa.update({
        where: { id },
        data: {
          titulo,
          descricao,
          disciplinaId,
          dataEntrega: dataEntrega ? new Date(dataEntrega) : null,
        },
      });

      return res.status(200).json(tarefaEditada);
    } catch (error) {
      console.error("❌ Erro ao editar tarefa:", error);
      return res.status(500).json({ error: "Erro ao editar tarefa." });
    }
  },
  async reordenar(req: AuthRequest, res: Response) {
    try {
      const { tarefas } = req.body;

      const atualizacoes = tarefas.map((t: any) =>
        prisma.tarefa.update({
          where: { id: t.id },
          data: { status: t.status, ordem: t.ordem },
        }),
      );
      await prisma.$transaction(atualizacoes);

      return res
        .status(200)
        .json({ message: "Reordenação concluída com sucesso!" });
    } catch (error) {
      console.error("❌ Erro ao reordenar tarefas:", error);
      return res.status(500).json({ error: "Erro ao reordenar tarefas." });
    }
  },
};
