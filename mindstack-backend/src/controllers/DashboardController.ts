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

      // 1. Puxa Cursos e Tarefas do banco
      const totalCursos = await prisma.curso.count({ where: { usuarioId } });
      const tarefas = await prisma.tarefa.findMany({
        where: { usuarioId },
        include: { disciplina: true }, // Traz a disciplina junto para agruparmos depois
      });

      // 2. Calcula os totais do Kanban
      const totalTarefas = tarefas.length;
      const concluidas = tarefas.filter((t) => t.status === "DONE").length;
      const emAndamento = tarefas.filter(
        (t) => t.status === "IN_PROGRESS",
      ).length;
      const aFazer = tarefas.filter((t) => t.status === "TODO").length;

      // 3. Monta os dados para o Gráfico de Pizza (Status)
      const graficoStatus = [
        { name: "Concluídas", value: concluidas, fill: "#10B981" }, // Verde
        { name: "Fazendo", value: emAndamento, fill: "#F59E0B" }, // Amarelo
        { name: "A Fazer", value: aFazer, fill: "#3B82F6" }, // Azul
      ];

      // 4. Monta os dados para o Gráfico de Barras (Tarefas por Disciplina)
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

      // 5. Devolve tudo mastigado pro Front-end!
      return res.status(200).json({
        cards: { totalCursos, totalTarefas, concluidas, emAndamento, aFazer },
        graficoStatus,
        graficoDisciplinas,
      });
    } catch (error) {
      console.error("Erro ao gerar dashboard:", error);
      return res
        .status(500)
        .json({ error: "Erro ao carregar dados do dashboard." });
    }
  }
}
