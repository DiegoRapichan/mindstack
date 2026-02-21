import { GoogleGenerativeAI } from "@google/generative-ai";

export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim() || "";
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não encontrada no arquivo .env");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);

    this.model = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });
  }

  async gerarResumo(textoOriginal: string): Promise<string> {
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
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error(
        "❌ Erro detalhado na API do Gemini:",
        error.message || error,
      );
      throw new Error("Falha ao processar o texto na Inteligência Artificial.");
    }
  }
}
