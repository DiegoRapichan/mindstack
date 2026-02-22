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
exports.AulaController = void 0;
const prisma_1 = require("../lib/prisma");
class AulaController {
    // 1. Cadastra uma nova aula (Ex: "Aula Inaugural de IA")
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { titulo, dataHora, linkVideo, disciplinaId } = req.body;
                const usuarioId = req.usuarioId;
                if (!titulo || !disciplinaId) {
                    return res
                        .status(400)
                        .json({ error: "Título e ID da disciplina são obrigatórios." });
                }
                const aula = yield prisma_1.prisma.aula.create({
                    data: {
                        titulo,
                        dataHora: dataHora ? new Date(dataHora) : null, // Salva a data certinha pro calendário
                        linkVideo: linkVideo || null,
                        disciplinaId,
                        usuarioId: usuarioId,
                        status: "PENDENTE", // Começa sempre como pendente (ainda não aconteceu)
                    },
                });
                return res.status(201).json(aula);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erro ao criar aula." });
            }
        });
    }
    // 2. Lista todas as aulas de uma matéria (Ordem cronológica)
    static listarPorDisciplina(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { disciplinaId } = req.params;
                const usuarioId = req.usuarioId;
                const aulas = yield prisma_1.prisma.aula.findMany({
                    where: { disciplinaId: String(disciplinaId), usuarioId },
                    orderBy: { dataHora: "asc" }, // Traz as aulas mais antigas primeiro
                    include: {
                        resumos: true, // Já traz os resumos atrelados a essa aula!
                    },
                });
                return res.status(200).json(aulas);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erro ao listar aulas." });
            }
        });
    }
    // 3. O SEU CONTROLE DE FALTAS! (Muda para PRESENTE, FALTA, etc)
    static atualizarStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { aulaId } = req.params;
                const { status } = req.body; // PENDENTE, PRESENTE, FALTA, ASSISTIDA_GRAVADA
                const usuarioId = req.usuarioId;
                const aula = yield prisma_1.prisma.aula.updateMany({
                    where: { id: String(aulaId), usuarioId },
                    data: { status },
                });
                return res
                    .status(200)
                    .json({ mensagem: "Status atualizado com sucesso!" });
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ error: "Erro ao atualizar status da aula." });
            }
        });
    }
}
exports.AulaController = AulaController;
