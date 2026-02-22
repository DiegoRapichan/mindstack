import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/authMiddleware";

export class CursoController {
  // 1. Criar um novo curso (agora com static)
  static async create(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { titulo, plataforma, tipo } = req.body;

      if (!titulo || !plataforma || !tipo) {
        return res
          .status(400)
          .json({ error: "Preencha todos os campos obrigatórios." });
      }

      const curso = await prisma.curso.create({
        data: {
          titulo,
          plataforma,
          tipo,
          status: "EM_ANDAMENTO",
          usuarioId: req.usuarioId as string,
        },
      });

      return res.status(201).json(curso);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar curso." });
    }
  }

  // 2. Listar os cursos do usuário logado (agora com static e createdAt)
  static async list(req: AuthRequest, res: Response): Promise<any> {
    try {
      const usuarioId = req.usuarioId;

      if (!usuarioId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const cursos = await prisma.curso.findMany({
        where: {
          usuarioId,
        },
        orderBy: {
          createdAt: "desc", // <--- CORRIGIDO AQUI! Ordena pela data de criação
        },
      });

      return res.status(200).json(cursos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar cursos." });
    }
  }
}
