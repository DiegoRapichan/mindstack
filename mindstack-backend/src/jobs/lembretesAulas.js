import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const iniciarCronJobs = () => {
  // Deixei '* * * * *' para rodar a cada 1 minuto e você poder testar agora.
  // Depois que funcionar, mude para '0 8 * * *' para rodar só às 08h da manhã.
  cron.schedule(
    "0 6 * * *",
    //"* * * * *",
    async () => {
      console.log("⏳ [CRON] Verificando aulas agendadas para hoje...");

      try {
        const hoje = new Date();
        // Define inicio e fim do dia atual
        const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
        const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999));

        const aulasDeHoje = await prisma.aula.findMany({
          where: {
            dataHora: {
              gte: inicioDoDia,
              lte: fimDoDia,
            },
          },
          include: {
            disciplina: true, // Traz os dados da disciplina para pegarmos o nome
          },
        });

        if (aulasDeHoje.length > 0) {
          console.log(
            `🔔 [LEMBRETE] Você tem ${aulasDeHoje.length} aula(s) hoje!`,
          );

          // Trocamos o forEach por for...of para podermos usar o 'await' do Prisma
          for (const aula of aulasDeHoje) {
            const horario = aula.dataHora
              ? aula.dataHora.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Horário a definir";

            const nomeDisciplina =
              aula.disciplina?.nome || "Disciplina desconhecida";

            // Mantemos o log no terminal para você continuar acompanhando
            console.log(
              `- ${nomeDisciplina} às ${horario} | Link: ${aula.linkVideo || "Nenhum link salvo"}`,
            );

            // NOVA PARTE: Salva a notificação no banco de dados!
            try {
              await prisma.notificacao.create({
                data: {
                  titulo: "Você tem aula hoje!",
                  mensagem: `Não se esqueça: aula de ${nomeDisciplina} às ${horario}.`,
                  // IMPORTANTE: Aqui assumimos que a tabela Aula tem um usuarioId.
                  // Se não tiver, me avise para ajustarmos a busca!
                  usuarioId: aula.usuarioId,
                },
              });
              console.log(`[✔] Notificação salva no banco para o usuário!`);
            } catch (err) {
              console.error(
                `[X] Erro ao salvar notificação no banco:`,
                err.message,
              );
            }
          }
        } else {
          console.log(
            "✅ [CRON] Nenhuma aula programada para hoje. Dia focado em estudos individuais!",
          );
        }
      } catch (error) {
        console.error("❌ [CRON] Erro ao processar lembretes de aula:", error);
      }
    },
    {
      scheduled: true,
      timezone: "America/Sao_Paulo",
    },
  );

  console.log("⏰ Cron Jobs de Lembretes iniciados com sucesso!");
};
