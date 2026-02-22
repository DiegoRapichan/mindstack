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
exports.TarefaController = void 0;
const prisma_1 = require("../lib/prisma");
class TarefaController {
    static criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { titulo, descricao, status, disciplinaId, dataEntrega, ordem, recorrente, } = req.body;
                const usuarioId = req.usuarioId;
                const tarefa = yield prisma_1.prisma.tarefa.create({
                    data: {
                        titulo,
                        descricao,
                        status: status || "TODO",
                        ordem: ordem || 0,
                        dataEntrega: dataEntrega ? new Date(dataEntrega) : null,
                        recorrente: recorrente || false,
                        disciplinaId,
                        usuarioId,
                    },
                });
                return res.status(201).json(tarefa);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erro ao criar tarefa." });
            }
        });
    }
    static listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioId = req.usuarioId;
                const tarefas = yield prisma_1.prisma.tarefa.findMany({
                    where: { usuarioId },
                    include: { disciplina: true },
                    orderBy: { ordem: "asc" },
                });
                return res.json(tarefas);
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao listar tarefas." });
            }
        });
    }
    static atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { titulo, descricao, status, disciplinaId, dataEntrega, ordem, recorrente, } = req.body;
                const usuarioId = req.usuarioId;
                const tarefa = yield prisma_1.prisma.tarefa.updateMany({
                    where: { id: String(id), usuarioId },
                    data: {
                        titulo,
                        descricao,
                        status,
                        ordem,
                        dataEntrega: dataEntrega ? new Date(dataEntrega) : null,
                        recorrente: recorrente !== undefined ? recorrente : undefined,
                        disciplinaId,
                    },
                });
                if (tarefa.count === 0) {
                    return res.status(404).json({ error: "Tarefa não encontrada." });
                }
                return res.json({ message: "Tarefa atualizada com sucesso!" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erro ao atualizar tarefa." });
            }
        });
    }
    static excluir(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const usuarioId = req.usuarioId;
                const tarefa = yield prisma_1.prisma.tarefa.deleteMany({
                    where: { id: String(id), usuarioId },
                });
                if (tarefa.count === 0) {
                    return res.status(404).json({ error: "Tarefa não encontrada." });
                }
                return res.json({ message: "Tarefa excluída com sucesso!" });
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao excluir tarefa." });
            }
        });
    }
    static reordenar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tarefas } = req.body;
                const tarefasOriginais = yield prisma_1.prisma.tarefa.findMany({
                    where: { id: { in: tarefas.map((t) => t.id) } },
                });
                const atualizacoes = [];
                const novasTarefas = [];
                for (const t of tarefas) {
                    atualizacoes.push(prisma_1.prisma.tarefa.update({
                        where: { id: t.id },
                        data: { status: t.status, ordem: t.ordem },
                    }));
                    const tarefaAntiga = tarefasOriginais.find((orig) => orig.id === t.id);
                    if ((tarefaAntiga === null || tarefaAntiga === void 0 ? void 0 : tarefaAntiga.recorrente) &&
                        tarefaAntiga.status !== "DONE" &&
                        t.status === "DONE") {
                        let novaDataEntrega = null;
                        if (tarefaAntiga.dataEntrega) {
                            const data = new Date(tarefaAntiga.dataEntrega);
                            data.setDate(data.getDate() + 7);
                            novaDataEntrega = data;
                        }
                        novasTarefas.push(prisma_1.prisma.tarefa.create({
                            data: {
                                titulo: tarefaAntiga.titulo,
                                descricao: tarefaAntiga.descricao,
                                status: "TODO",
                                ordem: 0,
                                recorrente: true,
                                dataEntrega: novaDataEntrega,
                                usuarioId: tarefaAntiga.usuarioId,
                                disciplinaId: tarefaAntiga.disciplinaId,
                            },
                        }));
                    }
                }
                yield prisma_1.prisma.$transaction([...atualizacoes, ...novasTarefas]);
                return res
                    .status(200)
                    .json({ message: "Reordenação concluída com sucesso!" });
            }
            catch (error) {
                console.error("Erro ao reordenar tarefas:", error);
                return res.status(500).json({ error: "Erro ao reordenar tarefas." });
            }
        });
    }
}
exports.TarefaController = TarefaController;
