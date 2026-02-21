import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/authMiddleware";

export class CursoController {
  // 1. Criar um novo curso
  async create(req: AuthRequest, res: Response) {
    try {
      // Lembra do middleware? Ele colocou o ID do usuário logado no req.usuarioId!
      const usuarioId = req.usuarioId;
      const { titulo, plataforma, status, tipo, dataInicio, dataFim } =
        req.body;

      if (!usuarioId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      // Cria o curso no banco e já amarra ele ao ID
      const curso = await prisma.curso.create({
        data: {
          titulo,
          plataforma,
          status: "EM_ANDAMENTO",
          tipo: "CURSO_LIVRE",
          usuarioId: req.usuarioId,
        },
      });

      return res.status(201).json(curso);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar o curso." });
    }
  }

  // 2. Listar os cursos do usuário logado
  async list(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.usuarioId;

      if (!usuarioId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      // Busca TODOS os cursos, mas APENAS os que pertencem a este usuário
      const cursos = await prisma.curso.findMany({
        where: {
          usuarioId,
        },
        orderBy: {
          dataInicio: "desc", // Traz os mais recentes primeiro
        },
      });

      return res.json(cursos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar cursos." });
    }
  }
}
