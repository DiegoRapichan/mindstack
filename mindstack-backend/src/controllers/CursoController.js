"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoController = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const authMiddleware_1 = require("../middlewares/authMiddleware");
class CursoController {
    // 1. Criar um novo curso (agora com static)
    static async create(req, res) {
        try {
            const { titulo, plataforma, tipo } = req.body;
            if (!titulo || !plataforma || !tipo) {
                return res
                    .status(400)
                    .json({ error: "Preencha todos os campos obrigatórios." });
            }
            const curso = await prisma_1.prisma.curso.create({
                data: {
                    titulo,
                    plataforma,
                    tipo,
                    status: "EM_ANDAMENTO",
                    usuarioId: req.usuarioId,
                },
            });
            return res.status(201).json(curso);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar curso." });
        }
    }
    // 2. Listar os cursos do usuário logado (agora com static e createdAt)
    static async list(req, res) {
        try {
            const usuarioId = req.usuarioId;
            if (!usuarioId) {
                return res.status(401).json({ error: "Usuário não autenticado." });
            }
            const cursos = await prisma_1.prisma.curso.findMany({
                where: {
                    usuarioId,
                },
                orderBy: {
                    createdAt: "desc", // <--- CORRIGIDO AQUI! Ordena pela data de criação
                },
            });
            return res.status(200).json(cursos);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar cursos." });
        }
    }
}
exports.CursoController = CursoController;
//# sourceMappingURL=CursoController.js.map