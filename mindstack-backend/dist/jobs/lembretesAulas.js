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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const iniciarCronJobs = () => {
    node_cron_1.default.schedule("0 6 * * *", 
    //"* * * * *",
    () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        console.log("⏳ [CRON] Verificando aulas agendadas para hoje...");
        try {
            const hoje = new Date();
            const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
            const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999));
            const aulasDeHoje = yield prisma.aula.findMany({
                where: {
                    dataHora: {
                        gte: inicioDoDia,
                        lte: fimDoDia,
                    },
                },
                include: {
                    disciplina: true,
                },
            });
            if (aulasDeHoje.length > 0) {
                console.log(`🔔 [LEMBRETE] Você tem ${aulasDeHoje.length} aula(s) hoje!`);
                for (const aula of aulasDeHoje) {
                    const horario = aula.dataHora
                        ? aula.dataHora.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "Horário a definir";
                    const nomeDisciplina = ((_a = aula.disciplina) === null || _a === void 0 ? void 0 : _a.nome) || "Disciplina desconhecida";
                    console.log(`- ${nomeDisciplina} às ${horario} | Link: ${aula.linkVideo || "Nenhum link salvo"}`);
                    try {
                        yield prisma.notificacao.create({
                            data: {
                                titulo: "Você tem aula hoje!",
                                mensagem: `Não se esqueça: aula de ${nomeDisciplina} às ${horario}.`,
                                usuarioId: aula.usuarioId,
                            },
                        });
                        console.log(`[✔] Notificação salva no banco para o usuário!`);
                    }
                    catch (err) {
                        console.error(`[X] Erro ao salvar notificação no banco:`, err.message);
                    }
                }
            }
            else {
                console.log("✅ [CRON] Nenhuma aula programada para hoje. Dia focado em estudos individuais!");
            }
        }
        catch (error) {
            console.error("❌ [CRON] Erro ao processar lembretes de aula:", error);
        }
    }), {
        timezone: "America/Sao_Paulo",
    });
    console.log("⏰ Cron Jobs de Lembretes iniciados com sucesso!");
};
exports.iniciarCronJobs = iniciarCronJobs;
