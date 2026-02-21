import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../lib/prisma";
import { AiService } from "../services/AiService";

// Diz pro TypeScript ignorar a falta de tipagens oficiais dessa lib
// @ts-ignore
import PDFParser from "pdf2json";

export class ResumoController {
  async uploadEGerar(req: AuthRequest, res: Response): Promise<any> {
    try {
      const file = req.file;
      const { cursoId } = req.body;
      const usuarioId = req.usuarioId;

      if (!file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      if (!cursoId) {
        return res
          .status(400)
          .json({ error: "É necessário informar o cursoId." });
      }

      const curso = await prisma.curso.findFirst({
        where: { id: cursoId, usuarioId },
      });

      if (!curso) {
        return res.status(404).json({ error: "Curso não encontrado." });
      }

      console.log("Extraindo texto do PDF com pdf2json...");

      // NOVA LÓGICA COM A BIBLIOTECA NOVA (pdf2json)
      const textoCru = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);

        pdfParser.on("pdfParser_dataError", (errData: any) =>
          reject(errData.parserError),
        );

        pdfParser.on("pdfParser_dataReady", () => {
          // Pega o texto e remove quebras de linha estranhas
          const rawText = pdfParser.getRawTextContent().replace(/\r\n/g, " ");
          resolve(rawText);
        });

        // Inicia a leitura do buffer que está na memória RAM
        pdfParser.parseBuffer(file.buffer);
      });

      if (!textoCru || textoCru.trim().length === 0) {
        return res
          .status(400)
          .json({ error: "Não foi possível extrair texto deste PDF." });
      }

      console.log("Enviando texto extraído para o Gemini resumir...");

      const aiService = new AiService();
      const resumoIA = await aiService.gerarResumo(textoCru);

      console.log("Sucesso! IA gerou o resumo.");

      return res.status(200).json({
        mensagem: "Resumo gerado com sucesso!",
        curso: curso.titulo,
        tamanhoOriginal: textoCru.length,
        resumo: resumoIA,
      });
    } catch (error: any) {
      console.error("Erro geral no Controller:", error);
      return res
        .status(500)
        .json({
          error: error.message || "Erro interno no processamento do resumo.",
        });
    }
  }
}
