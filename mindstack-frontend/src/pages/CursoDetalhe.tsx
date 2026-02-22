import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  X,
  GraduationCap,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

interface Disciplina {
  id: string;
  nome: string;
  professor: string | null;
  maxFaltasPermitidas: number | null;
}

export function CursoDetalhe() {
  const { cursoId } = useParams();
  const navigate = useNavigate();

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [maxFaltas, setMaxFaltas] = useState("");

  useEffect(() => {
    async function carregarDisciplinas() {
      try {
        const response = await api.get(`/disciplinas/curso/${cursoId}`);
        setDisciplinas(response.data);
      } catch (error) {
        console.error("Erro ao carregar disciplinas", error);
      }
    }
    if (cursoId) carregarDisciplinas();
  }, [cursoId]);

  async function handleCriarDisciplina(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post("/disciplinas", {
        nome,
        professor,
        maxFaltasPermitidas: maxFaltas ? Number(maxFaltas) : null,
        cursoId,
      });

      setDisciplinas([...disciplinas, response.data]);

      setNome("");
      setProfessor("");
      setMaxFaltas("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar disciplina", error);
      alert("Erro ao criar a disciplina. Verifique o console.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-500">
              Matérias do Curso
            </h1>
            <p className="text-gray-400">
              Gerencie as disciplinas, notas e faltas
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Nova Matéria
        </button>
      </header>

      {/* Grid de Disciplinas */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {disciplinas.length === 0 ? (
          <div className="col-span-full bg-gray-800 p-8 rounded-2xl border border-gray-700 border-dashed flex flex-col items-center justify-center text-center h-64">
            <GraduationCap className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-lg">
              Nenhuma matéria cadastrada neste curso.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Clique em "Nova Matéria" ali em cima para começar.
            </p>
          </div>
        ) : (
          disciplinas.map((disciplina) => (
            <div
              key={disciplina.id}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {disciplina.nome}
                  </h3>
                </div>

                {disciplina.professor && (
                  <p className="text-gray-400 text-sm mb-2">
                    👨‍🏫 Prof:{" "}
                    <span className="text-gray-300">
                      {disciplina.professor}
                    </span>
                  </p>
                )}

                {disciplina.maxFaltasPermitidas && (
                  <p className="flex items-center gap-1 text-yellow-500/90 text-sm mb-6">
                    <AlertTriangle className="w-4 h-4" />
                    Limite de Faltas: {disciplina.maxFaltasPermitidas}
                  </p>
                )}
              </div>

              {/* Este botão vai levar para a tela de Aulas e Notas no próximo passo! */}
              <button
                onClick={() => navigate(`/disciplina/${disciplina.id}`)}
                className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-4"
              >
                <span>Acessar Aulas e Notas</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </main>

      {/* Modal de Criar Disciplina */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Cadastrar Matéria
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCriarDisciplina} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome da Matéria *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Banco de Dados Relacional"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome do Professor (Opcional)
                </label>
                <input
                  type="text"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Prof. Gustavo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Limite de Faltas (Opcional)
                </label>
                <input
                  type="number"
                  value={maxFaltas}
                  onChange={(e) => setMaxFaltas(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: 4"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  O sistema vai te avisar se você chegar perto desse limite.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-6"
              >
                Salvar Matéria
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
