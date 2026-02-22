"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarefaController = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const prisma_1 = require("../lib/prisma");
class TarefaController {
    static async criar(req, res) {
        try {
            const { titulo, descricao, status, disciplinaId, dataEntrega, ordem, recorrente, } = req.body;
            const usuarioId = req.usuarioId;
            const tarefa = await prisma_1.prisma.tarefa.create({
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
    }
    static async listar(req, res) {
        try {
            const usuarioId = req.usuarioId;
            const tarefas = await prisma_1.prisma.tarefa.findMany({
                where: { usuarioId },
                include: { disciplina: true },
                orderBy: { ordem: "asc" },
            });
            return res.json(tarefas);
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao listar tarefas." });
        }
    }
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { titulo, descricao, status, disciplinaId, dataEntrega, ordem, recorrente, } = req.body;
            const usuarioId = req.usuarioId;
            const tarefa = await prisma_1.prisma.tarefa.updateMany({
                where: { id, usuarioId },
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
    }
    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const usuarioId = req.usuarioId;
            const tarefa = await prisma_1.prisma.tarefa.deleteMany({
                where: { id, usuarioId },
            });
            if (tarefa.count === 0) {
                return res.status(404).json({ error: "Tarefa não encontrada." });
            }
            return res.json({ message: "Tarefa excluída com sucesso!" });
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao excluir tarefa." });
        }
    }
    static async reordenar(req, res) {
        try {
            const { tarefas } = req.body;
            const tarefasOriginais = await prisma_1.prisma.tarefa.findMany({
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
                if (tarefaAntiga?.recorrente &&
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
            await prisma_1.prisma.$transaction([...atualizacoes, ...novasTarefas]);
            return res
                .status(200)
                .json({ message: "Reordenação concluída com sucesso!" });
        }
        catch (error) {
            console.error("Erro ao reordenar tarefas:", error);
            return res.status(500).json({ error: "Erro ao reordenar tarefas." });
        }
    }
}
exports.TarefaController = TarefaController;
//# sourceMappingURL=TarefaController.js.map