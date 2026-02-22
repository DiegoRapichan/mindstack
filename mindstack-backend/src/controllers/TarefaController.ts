import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

export const TarefaController = {
  // 1. Listar tarefas do Kanban do usuário
  async listar(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.userId; // ou req.usuario.id, conforme seu auth

      const tarefas = await prisma.tarefa.findMany({
        where: { usuarioId },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(tarefas);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar tarefas." });
    }
  },

  // 2. Criar novo card
  async criar(req: AuthRequest, res: Response) {
    console.log("➡️ [POST] /tarefas - Requisição bateu no Controller!");

    try {
      const usuarioId = req.usuarioId;
      console.log("👤 ID do Usuário Logado:", usuarioId);

      const { titulo, descricao, status, disciplinaId } = req.body;
      console.log("📦 Dados recebidos do Front-end:", {
        titulo,
        descricao,
        status,
        disciplinaId,
      });

      if (!usuarioId) {
        console.log("❌ Bloqueado: Usuário sem ID");
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      console.log("⏳ Tentando salvar no banco de dados...");
      const novaTarefa = await prisma.tarefa.create({
        data: {
          titulo,
          descricao,
          status: status || "TODO",
          usuarioId,
          disciplinaId,
        },
      });

      console.log(`✅ Tarefa salva no banco com sucesso! ID:`, novaTarefa.id);
      return res.status(201).json(novaTarefa);
    } catch (error) {
      console.error("💥 ERRO AO CRIAR TAREFA NO BANCO:", error);
      return res.status(500).json({ error: "Erro ao criar tarefa." });
    }
  },

  async atualizarStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'TODO', 'IN_PROGRESS' ou 'DONE'

      const tarefaAtualizada = await prisma.tarefa.update({
        where: { id },
        data: { status },
      });

      return res.status(200).json(tarefaAtualizada);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao mover a tarefa." });
    }
  },
};
