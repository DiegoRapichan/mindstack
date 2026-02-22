import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  ArrowLeft,
  Plus,
  Video,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  UploadCloud,
  X,
  Loader2,
} from "lucide-react";

interface Aula {
  id: string;
  titulo: string;
  dataHora: string | null;
  linkVideo: string | null;
  status: "PENDENTE" | "PRESENTE" | "FALTA" | "ASSISTIDA_GRAVADA";
  resumos?: { id: string; conteudo: string }[];
}

export function DisciplinaDetalhe() {
  const { disciplinaId } = useParams();
  const navigate = useNavigate();

  const [aulas, setAulas] = useState<Aula[]>([]);
  const [isModalAulaOpen, setIsModalAulaOpen] = useState(false);

  const [isModalResumoOpen, setIsModalResumoOpen] = useState(false);
  const [aulaSelecionadaId, setAulaSelecionadaId] = useState<string | null>(
    null,
  );
  const [arquivoPdf, setArquivoPdf] = useState<File | null>(null);
  const [isGerando, setIsGerando] = useState(false);
  const [resumoGerado, setResumoGerado] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [linkVideo, setLinkVideo] = useState("");

  useEffect(() => {
    carregarAulas();
  }, [disciplinaId]);

  async function carregarAulas() {
    try {
      const response = await api.get(`/aulas/disciplina/${disciplinaId}`);
      setAulas(response.data);
    } catch (error) {
      console.error("Erro ao carregar aulas", error);
    }
  }

  async function handleCriarAula(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/aulas", { titulo, dataHora, linkVideo, disciplinaId });
      setTitulo("");
      setDataHora("");
      setLinkVideo("");
      setIsModalAulaOpen(false);
      carregarAulas();
    } catch (error) {
      alert("Erro ao criar a aula.");
    }
  }

  async function alterarStatus(aulaId: string, novoStatus: string) {
    try {
      await api.patch(`/aulas/${aulaId}/status`, { status: novoStatus });
      carregarAulas();
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  }

  async function handleGerarResumoIA(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivoPdf || !disciplinaId) return;

    setIsGerando(true);
    setResumoGerado(null);

    const formData = new FormData();
    formData.append("pdf", arquivoPdf);
    formData.append("disciplinaId", disciplinaId);
    if (aulaSelecionadaId) {
      formData.append("aulaId", aulaSelecionadaId);
    }

    try {
      const response = await api.post("/resumos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumoGerado(response.data.conteudo);
      carregarAulas();
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar o resumo. Verifique o console.");
    } finally {
      setIsGerando(false);
    }
  }

  function abrirModalResumo(aulaId: string) {
    setAulaSelecionadaId(aulaId);
    setArquivoPdf(null);
    setResumoGerado(null);
    setIsModalResumoOpen(true);
  }

  function verResumoSalvo(conteudo: string) {
    setArquivoPdf(null);
    setResumoGerado(conteudo);
    setIsModalResumoOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-500">
              Cronograma de Aulas
            </h1>
            <p className="text-gray-400">
              Gerencie links, presenças e resumos de IA
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalAulaOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
        >
          <Plus className="w-5 h-5" /> Nova Aula
        </button>
      </header>

      <main className="space-y-4">
        {aulas.length === 0 ? (
          <p className="text-gray-400 text-center py-10">
            Nenhuma aula cadastrada ainda.
          </p>
        ) : (
          aulas.map((aula) => (
            <div
              key={aula.id}
              className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  {aula.titulo}
                </h3>
                {aula.dataHora && (
                  <p className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    {new Date(aula.dataHora).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Botão de Vídeo */}
                {aula.linkVideo && (
                  <a
                    href={aula.linkVideo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm text-blue-400"
                  >
                    <Video className="w-4 h-4" /> Acessar Aula
                  </a>
                )}

                {/* Botões de Presença/Falta */}
                <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg border border-gray-700">
                  <button
                    onClick={() => alterarStatus(aula.id, "PRESENTE")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${aula.status === "PRESENTE" ? "bg-green-600 text-white" : "text-gray-400 hover:bg-gray-800"}`}
                  >
                    <CheckCircle className="w-4 h-4" /> Presente
                  </button>
                  <button
                    onClick={() => alterarStatus(aula.id, "FALTA")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${aula.status === "FALTA" ? "bg-red-600 text-white" : "text-gray-400 hover:bg-gray-800"}`}
                  >
                    <XCircle className="w-4 h-4" /> Falta
                  </button>
                </div>

                {/* LÓGICA DO BOTÃO DE RESUMO */}
                {aula.resumos && aula.resumos.length > 0 ? (
                  <button
                    onClick={() => {
                      const textoDoResumo =
                        aula.resumos && aula.resumos.length > 0
                          ? aula.resumos[0].conteudo
                          : "";
                      verResumoSalvo(textoDoResumo);
                    }}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Ver Resumo
                  </button>
                ) : (
                  <button
                    onClick={() => abrirModalResumo(aula.id)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <UploadCloud className="w-4 h-4" /> Gerar Resumo IA
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* MODAL DE NOVA AULA */}
      {isModalAulaOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              Cadastrar Aula
            </h2>
            <form onSubmit={handleCriarAula} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Título da Aula *
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Data e Hora (Opcional)
                </label>
                <input
                  type="datetime-local"
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Link do Zoom/Meet (Opcional)
                </label>
                <input
                  type="url"
                  value={linkVideo}
                  onChange={(e) => setLinkVideo(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalAulaOpen(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg font-medium"
                >
                  Salvar Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE RESUMO IA */}
      {isModalResumoOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                <FileText className="w-6 h-6" /> Resumo Inteligente
              </h2>
              <button
                onClick={() => setIsModalResumoOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!resumoGerado ? (
              <form onSubmit={handleGerarResumoIA} className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                  <UploadCloud className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-300 font-medium mb-2">
                    Selecione o PDF da aula
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setArquivoPdf(e.target.files ? e.target.files[0] : null)
                    }
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!arquivoPdf || isGerando}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {isGerando ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Analisando
                      com Gemini...
                    </>
                  ) : (
                    "Gerar Resumo da Aula"
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {resumoGerado}
                </div>
                <button
                  onClick={() => setIsModalResumoOpen(false)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
