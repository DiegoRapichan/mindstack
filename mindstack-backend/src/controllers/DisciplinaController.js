"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisciplinaController = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const prisma_1 = require("../lib/prisma");
class DisciplinaController {
    static async create(req, res) {
        try {
            const { nome, professor, maxFaltasPermitidas, cursoId } = req.body;
            const usuarioId = req.usuarioId;
            if (!nome || !cursoId) {
                return res.status(400).json({
                    error: "Nome da disciplina e ID do curso são obrigatórios.",
                });
            }
            const curso = await prisma_1.prisma.curso.findFirst({
                where: { id: cursoId, usuarioId },
            });
            if (!curso) {
                return res.status(404).json({ error: "Curso não encontrado." });
            }
            const disciplina = await prisma_1.prisma.disciplina.create({
                data: {
                    nome,
                    professor: professor || null,
                    maxFaltasPermitidas: maxFaltasPermitidas
                        ? Number(maxFaltasPermitidas)
                        : null,
                    cursoId,
                    usuarioId: usuarioId,
                },
            });
            return res.status(201).json(disciplina);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar disciplina." });
        }
    }
    static async listarPorCurso(req, res) {
        try {
            const { cursoId } = req.params;
            const usuarioId = req.usuarioId;
            const disciplinas = await prisma_1.prisma.disciplina.findMany({
                where: {
                    cursoId,
                    usuarioId,
                },
                orderBy: { nome: "asc" },
            });
            return res.status(200).json(disciplinas);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao listar disciplinas." });
        }
    }
    static async listarTodas(req, res) {
        try {
            const usuarioId = req.usuarioId;
            if (!usuarioId) {
                return res.status(401).json({ error: "Usuário não autenticado." });
            }
            const disciplinas = await prisma_1.prisma.disciplina.findMany({
                where: { usuarioId },
                orderBy: { nome: "asc" },
            });
            return res.status(200).json(disciplinas);
        }
        catch (error) {
            console.error("Erro ao listar todas as disciplinas:", error);
            return res
                .status(500)
                .json({ error: "Erro interno ao buscar disciplinas." });
        }
    }
}
exports.DisciplinaController = DisciplinaController;
//# sourceMappingURL=DisciplinaController.js.map