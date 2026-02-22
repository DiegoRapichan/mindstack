import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../lib/prisma";

export class AulaController {
  // 1. Cadastra uma nova aula (Ex: "Aula Inaugural de IA")
  static async create(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { titulo, dataHora, linkVideo, disciplinaId } = req.body;
      const usuarioId = req.usuarioId;

      if (!titulo || !disciplinaId) {
        return res
          .status(400)
          .json({ error: "Título e ID da disciplina são obrigatórios." });
      }

      const aula = await prisma.aula.create({
        data: {
          titulo,
          dataHora: dataHora ? new Date(dataHora) : null, // Salva a data certinha pro calendário
          linkVideo: linkVideo || null,
          disciplinaId,
          usuarioId: usuarioId as string,
          status: "PENDENTE", // Começa sempre como pendente (ainda não aconteceu)
        },
      });

      return res.status(201).json(aula);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar aula." });
    }
  }

  // 2. Lista todas as aulas de uma matéria (Ordem cronológica)
  static async listarPorDisciplina(
    req: AuthRequest,
    res: Response,
  ): Promise<any> {
    try {
      const { disciplinaId } = req.params;
      const usuarioId = req.usuarioId;

      const aulas = await prisma.aula.findMany({
        where: { disciplinaId: String(disciplinaId), usuarioId },
        orderBy: { dataHora: "asc" }, // Traz as aulas mais antigas primeiro
        include: {
          resumos: true, // Já traz os resumos atrelados a essa aula!
        },
      });

      return res.status(200).json(aulas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao listar aulas." });
    }
  }

  // 3. O SEU CONTROLE DE FALTAS! (Muda para PRESENTE, FALTA, etc)
  static async atualizarStatus(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { aulaId } = req.params;
      const { status } = req.body; // PENDENTE, PRESENTE, FALTA, ASSISTIDA_GRAVADA
      const usuarioId = req.usuarioId;

      const aula = await prisma.aula.updateMany({
        where: { id: String(aulaId), usuarioId },
        data: { status },
      });

      return res
        .status(200)
        .json({ mensagem: "Status atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar status da aula." });
    }
  }
}
