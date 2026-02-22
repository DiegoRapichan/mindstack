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
exports.NotificacaoController = void 0;
const prisma_1 = require("../lib/prisma");
class NotificacaoController {
    static buscarNotificacoes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioId = req.usuarioId;
                const notificacoes = yield prisma_1.prisma.notificacao.findMany({
                    where: { usuarioId },
                    orderBy: { createdAt: "desc" },
                });
                return res.json(notificacoes);
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao buscar notificações." });
            }
        });
    }
    static marcarComoLida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const usuarioId = req.usuarioId;
                const notificacao = yield prisma_1.prisma.notificacao.updateMany({
                    where: { id: String(id), usuarioId },
                    data: { lida: true },
                });
                return res.json({ message: "Notificação lida." });
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao atualizar." });
            }
        });
    }
    static marcarTodasComoLidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioId = req.usuarioId;
                yield prisma_1.prisma.notificacao.updateMany({
                    where: { usuarioId, lida: false },
                    data: { lida: true },
                });
                return res.json({ message: "Todas lidas." });
            }
            catch (error) {
                return res.status(500).json({ error: "Erro." });
            }
        });
    }
}
exports.NotificacaoController = NotificacaoController;
