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
exports.DashboardController = void 0;
const prisma_1 = require("../lib/prisma");
class DashboardController {
    static getResumo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioId = req.usuarioId;
                if (!usuarioId) {
                    return res.status(401).json({ error: "Usuário não autenticado." });
                }
                const totalCursos = yield prisma_1.prisma.curso.count({ where: { usuarioId } });
                const tarefas = yield prisma_1.prisma.tarefa.findMany({
                    where: { usuarioId },
                    include: { disciplina: true },
                });
                const totalTarefas = tarefas.length;
                const concluidas = tarefas.filter((t) => t.status === "DONE").length;
                const emAndamento = tarefas.filter((t) => t.status === "IN_PROGRESS").length;
                const aFazer = tarefas.filter((t) => t.status === "TODO").length;
                const graficoStatus = [
                    { name: "Concluídas", value: concluidas, fill: "#10B981" },
                    { name: "Fazendo", value: emAndamento, fill: "#F59E0B" },
                    { name: "A Fazer", value: aFazer, fill: "#3B82F6" },
                ];
                const tarefasPorDisciplina = {};
                tarefas.forEach((t) => {
                    var _a;
                    const nomeDisciplina = ((_a = t.disciplina) === null || _a === void 0 ? void 0 : _a.nome) || "Sem Disciplina";
                    tarefasPorDisciplina[nomeDisciplina] =
                        (tarefasPorDisciplina[nomeDisciplina] || 0) + 1;
                });
                const graficoDisciplinas = Object.entries(tarefasPorDisciplina).map(([nome, quantidade]) => ({
                    name: nome,
                    tarefas: quantidade,
                }));
                const ultimos7Dias = {};
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dataFormatada = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
                    ultimos7Dias[dataFormatada] = 0;
                }
                tarefas
                    .filter((t) => t.status === "DONE")
                    .forEach((t) => {
                    const dataAtt = new Date(t.updatedAt);
                    const dataFormatada = `${dataAtt.getDate().toString().padStart(2, "0")}/${(dataAtt.getMonth() + 1).toString().padStart(2, "0")}`;
                    if (ultimos7Dias[dataFormatada] !== undefined) {
                        ultimos7Dias[dataFormatada] += 1;
                    }
                });
                const graficoProdutividade = Object.entries(ultimos7Dias).map(([data, quantidade]) => ({
                    data,
                    concluidas: quantidade,
                }));
                return res.status(200).json({
                    cards: { totalCursos, totalTarefas, concluidas, emAndamento, aFazer },
                    graficoStatus,
                    graficoDisciplinas,
                    graficoProdutividade,
                });
            }
            catch (error) {
                console.error("Erro ao gerar dashboard:", error);
                return res
                    .status(500)
                    .json({ error: "Erro ao carregar dados do dashboard." });
            }
        });
    }
}
exports.DashboardController = DashboardController;
