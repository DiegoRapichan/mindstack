import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../lib/prisma";
import { AiService } from "../services/AiService";

// @ts-ignore
import PDFParser from "pdf2json";

export class ResumoController {
  static async create(req: AuthRequest, res: Response): Promise<any> {
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

      const disciplina = await prisma.disciplina.findFirst({
        where: { id: String(disciplinaId), usuarioId },
      });

      if (!disciplina) {
        return res.status(404).json({ error: "Disciplina não encontrada." });
      }

      console.log("Extraindo texto do PDF...");

      const textoCru = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        pdfParser.on("pdfParser_dataError", (errData: any) =>
          reject(errData.parserError),
        );
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
      const aiService = new AiService();
      const resumoIA = await aiService.gerarResumo(textoCru);

      console.log("Salvando resumo no banco...");
      const resumoSalvo = await prisma.resumo.create({
        data: {
          conteudo: resumoIA,
          tamanhoOriginal: textoCru.length,
          disciplinaId: String(disciplinaId),
          aulaId: aulaId ? String(aulaId) : null,
        },
      });

      return res.status(200).json(resumoSalvo);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message || "Erro interno." });
    }
  }
}
