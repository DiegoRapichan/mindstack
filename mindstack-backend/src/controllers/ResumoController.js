"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumoController = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const prisma_1 = require("../lib/prisma");
const AiService_1 = require("../services/AiService");
// @ts-ignore
const pdf2json_1 = __importDefault(require("pdf2json"));
class ResumoController {
    static async create(req, res) {
        try {
            const file = req.file;
            const { disciplinaId, aulaId } = req.body;
            const usuarioId = req.usuarioId;
            if (!file) {
                return res.status(400).json({ error: "Nenhum arquivo enviado." });
            }
            if (!disciplinaId) {
                return res
                    .status(400)
                    .json({ error: "É necessário informar o ID da disciplina." });
            }
            const disciplina = await prisma_1.prisma.disciplina.findFirst({
                where: { id: String(disciplinaId), usuarioId },
            });
            if (!disciplina) {
                return res.status(404).json({ error: "Disciplina não encontrada." });
            }
            console.log("Extraindo texto do PDF...");
            const textoCru = await new Promise((resolve, reject) => {
                const pdfParser = new pdf2json_1.default(null, 1);
                pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
                pdfParser.on("pdfParser_dataReady", () => {
                    resolve(pdfParser.getRawTextContent().replace(/\r\n/g, " "));
                });
                pdfParser.parseBuffer(file.buffer);
            });
            if (!textoCru || textoCru.trim().length === 0) {
                return res
                    .status(400)
                    .json({ error: "Não foi possível extrair texto deste PDF." });
            }
            console.log("Enviando para o Gemini...");
            const aiService = new AiService_1.AiService();
            const resumoIA = await aiService.gerarResumo(textoCru);
            console.log("Salvando resumo no banco...");
            const resumoSalvo = await prisma_1.prisma.resumo.create({
                data: {
                    conteudo: resumoIA,
                    tamanhoOriginal: textoCru.length,
                    disciplinaId: String(disciplinaId),
                    aulaId: aulaId ? String(aulaId) : null,
                },
            });
            return res.status(200).json(resumoSalvo);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message || "Erro interno." });
        }
    }
}
exports.ResumoController = ResumoController;
//# sourceMappingURL=ResumoController.js.map