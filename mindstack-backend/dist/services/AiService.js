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
exports.AiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class AiService {
    constructor() {
        var _a;
        const apiKey = ((_a = process.env.GEMINI_API_KEY) === null || _a === void 0 ? void 0 : _a.trim()) || "";
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY não encontrada no arquivo .env");
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-flash-latest",
        });
    }
    gerarResumo(textoOriginal) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
      Você é um professor universitário e mentor de carreira na área de tecnologia (Engenharia de Software, IA e Back-end).
      O aluno enviou o texto de um PDF de uma aula. 

      Sua tarefa:
      1. Leia o texto e extraia os conceitos principais.
      2. Crie um resumo bem estruturado, usando Markdown (títulos, bullet points e negritos).
      3. Seja direto e objetivo, mas não superficial. Se houver código no texto, explique a lógica dele.
      4. No final, adicione uma pequena seção "Insight de Sinergia" sugerindo como esse assunto se conecta com o mercado de trabalho atual.

      TEXTO DA AULA:
      "${textoOriginal}"
    `;
            try {
                console.log("🚀 Enviando para o Gemini ...");
                const result = yield this.model.generateContent(prompt);
                const response = yield result.response;
                return response.text();
            }
            catch (error) {
                console.error("❌ Erro detalhado na API do Gemini:", error.message || error);
                throw new Error("Falha ao processar o texto na Inteligência Artificial.");
            }
        });
    }
}
exports.AiService = AiService;
