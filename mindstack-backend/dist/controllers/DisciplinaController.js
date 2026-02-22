"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisciplinaController = void 0;
const prisma_1 = require("../lib/prisma");
class DisciplinaController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, professor, maxFaltasPermitidas, cursoId } = req.body;
                const usuarioId = req.usuarioId;
                if (!nome || !cursoId) {
                    return res.status(400).json({
                        error: "Nome da disciplina e ID do curso são obrigatórios.",
                    });
                }
                const curso = yield prisma_1.prisma.curso.findFirst({
                    where: { id: cursoId, usuarioId },
                });
                if (!curso) {
                    return res.status(404).json({ error: "Curso não encontrado." });
                }
                const disciplina = yield prisma_1.prisma.disciplina.create({
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
        });
    }
    static listarPorCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cursoId } = req.params;
                const usuarioId = req.usuarioId;
                const disciplinas = yield prisma_1.prisma.disciplina.findMany({
                    where: {
                        cursoId: String(cursoId),
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
        });
    }
    static listarTodas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioId = req.usuarioId;
                if (!usuarioId) {
                    return res.status(401).json({ error: "Usuário não autenticado." });
                }
                const disciplinas = yield prisma_1.prisma.disciplina.findMany({
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
        });
    }
}
exports.DisciplinaController = DisciplinaController;
