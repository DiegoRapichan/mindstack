import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../lib/prisma";

export class DashboardController {
  static async getResumo(req: AuthRequest, res: Response): Promise<any> {
    try {
      const usuarioId = req.usuarioId;

      if (!usuarioId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const totalCursos = await prisma.curso.count({ where: { usuarioId } });
      const tarefas = await prisma.tarefa.findMany({
        where: { usuarioId },
        include: { disciplina: true },
      });

      const totalTarefas = tarefas.length;
      const concluidas = tarefas.filter((t) => t.status === "DONE").length;
      const emAndamento = tarefas.filter(
        (t) => t.status === "IN_PROGRESS",
      ).length;
      const aFazer = tarefas.filter((t) => t.status === "TODO").length;

      const graficoStatus = [
        { name: "Concluídas", value: concluidas, fill: "#10B981" },
        { name: "Fazendo", value: emAndamento, fill: "#F59E0B" },
        { name: "A Fazer", value: aFazer, fill: "#3B82F6" },
      ];

      const tarefasPorDisciplina: Record<string, number> = {};
      tarefas.forEach((t) => {
        const nomeDisciplina = t.disciplina?.nome || "Sem Disciplina";
        tarefasPorDisciplina[nomeDisciplina] =
          (tarefasPorDisciplina[nomeDisciplina] || 0) + 1;
      });

      const graficoDisciplinas = Object.entries(tarefasPorDisciplina).map(
        ([nome, quantidade]) => ({
          name: nome,
          tarefas: quantidade,
        }),
      );

      const ultimos7Dias: Record<string, number> = {};
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

      const graficoProdutividade = Object.entries(ultimos7Dias).map(
        ([data, quantidade]) => ({
          data,
          concluidas: quantidade,
        }),
      );

      return res.status(200).json({
        cards: { totalCursos, totalTarefas, concluidas, emAndamento, aFazer },
        graficoStatus,
        graficoDisciplinas,
        graficoProdutividade,
      });
    } catch (error) {
      console.error("Erro ao gerar dashboard:", error);
      return res
        .status(500)
        .json({ error: "Erro ao carregar dados do dashboard." });
    }
  }
}
