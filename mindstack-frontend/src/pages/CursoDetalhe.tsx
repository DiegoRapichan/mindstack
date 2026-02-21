import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  ArrowLeft,
  FileText,
  UploadCloud,
  BrainCircuit,
  Loader2,
} from "lucide-react";

interface Resumo {
  id: string;
  conteudo: string;
  createdAt: string;
}

export function CursoDetalhe() {
  const { cursoId } = useParams(); // Pega o ID do curso da URL
  const navigate = useNavigate();

  const [resumos, setResumos] = useState<Resumo[]>([]);
  const [arquivoPdf, setArquivoPdf] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Busca os resumos deste curso ao carregar a página
  useEffect(() => {
    async function carregarResumos() {
      try {
        const response = await api.get(`/resumos/cursos/${cursoId}`);
        setResumos(response.data);
      } catch (error) {
        console.error("Erro ao carregar resumos", error);
      }
    }
    if (cursoId) carregarResumos();
  }, [cursoId]);

  // Função que envia o PDF para o Back-end (que vai chamar o Gemini)
  async function handleUploadPdf(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivoPdf || !cursoId) return;

    setIsLoading(true);

    // Como estamos enviando um arquivo, precisamos usar o FormData em vez de JSON
    const formData = new FormData();
    formData.append("pdf", arquivoPdf);
    formData.append("cursoId", cursoId);

    try {
      // Bate na rota maravilhosa que criamos com o Multer + pdf2json + Gemini!
      const response = await api.post("/resumos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Adiciona o novo resumo gerado pela IA no topo da lista
      setResumos([response.data.resumo, ...resumos]);
      setArquivoPdf(null); // Limpa o arquivo selecionado
      alert("Resumo gerado com Inteligência Artificial! 🧠✨");
    } catch (error) {
      console.error("Erro ao gerar resumo", error);
      alert("Erro ao processar o PDF. Verifique o console.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Cabeçalho */}
      <header className="flex items-center gap-4 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Área de Estudos</h1>
          <p className="text-gray-400">Gerencie os resumos deste curso</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: Upload do PDF */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Gerar Resumo com IA
              </h2>
            </div>

            <form onSubmit={handleUploadPdf} className="space-y-4">
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-purple-500 transition-colors">
                <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-300 mb-2">
                  Selecione o PDF do material da aula
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setArquivoPdf(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 cursor-pointer"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!arquivoPdf || isLoading}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Analisando e
                    Gerando...
                  </>
                ) : (
                  "Gerar Resumo Mágico"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Coluna da Direita: Lista de Resumos Gerados */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Meus Resumos</h2>

          {resumos.length === 0 ? (
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 border-dashed text-center">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                Nenhum resumo gerado ainda.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Faça o upload do seu primeiro PDF ao lado!
              </p>
            </div>
          ) : (
            resumos.map((resumo) => (
              <div
                key={resumo.id}
                className="bg-gray-800 p-6 rounded-2xl border border-gray-700"
              >
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <BrainCircuit className="w-5 h-5" />
                    <span className="font-medium text-sm">Resumo da IA</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(resumo.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {/* O conteúdo do Gemini vem com marcação Markdown (asteriscos, hashtags). Vamos renderizar o texto preservando as quebras de linha! */}
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {resumo.conteudo}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
