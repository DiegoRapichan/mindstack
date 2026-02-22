import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { BookOpen, Plus, FileText, X } from "lucide-react";

interface Curso {
  id: string;
  titulo: string;
  plataforma: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [tipo, setTipo] = useState("CURSO_LIVRE");

  // Pega o usuário logado
  const usuarioString = localStorage.getItem("@Mindstack:user");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  // Busca os cursos assim que a tela abre
  useEffect(() => {
    async function carregarCursos() {
      try {
        const response = await api.get("/cursos");
        setCursos(response.data); // Pega os cursos do banco e joga na tela!
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
      }
    }

    carregarCursos();
  }, []);

  function handleLogout() {
    localStorage.removeItem("@Mindstack:token");
    localStorage.removeItem("@Mindstack:user");
    navigate("/");
  }

  async function handleCriarCurso(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Fazemos apenas UMA chamada para a API enviando tudo (titulo, plataforma e tipo)
      const response = await api.post("/cursos", { titulo, plataforma, tipo });

      setCursos([...cursos, response.data]);

      setTitulo("");
      setPlataforma("");
      setTipo("CURSO_LIVRE");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar curso", error);
      alert("Erro ao criar o curso.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Mindstack</h1>
          <p className="text-gray-400">
            Bem-vindo(a),{" "}
            <span className="text-white font-medium">{usuario?.nome}</span>!
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Sair
        </button>
      </header>

      {/* Título e Botão Novo Curso */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-300">Meus Cursos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Novo Curso
        </button>
      </div>

      {/* Grid de Cursos */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cursos.length === 0 ? (
          <div className="col-span-1 md:col-span-3 bg-gray-800 p-8 rounded-2xl border border-gray-700 border-dashed flex flex-col items-center justify-center text-center h-64">
            <BookOpen className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-400">
              Você ainda não tem cursos cadastrados.
            </p>
          </div>
        ) : (
          cursos.map((curso) => (
            <div
              key={curso.id}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/20 p-3 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {curso.titulo}
              </h3>
              <p className="text-gray-400 text-sm mb-6">{curso.plataforma}</p>
              <button
                onClick={() => navigate(`/curso/${curso.id}`)}
                className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <FileText className="w-4 h-4" /> Acessar Matérias
              </button>
            </div>
          ))
        )}
      </main>

      {/* Modal de Criar Curso */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Cadastrar Novo Curso
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCriarCurso} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Título do Curso
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Formação Node.js"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Plataforma
                </label>
                <input
                  type="text"
                  value={plataforma}
                  onChange={(e) => setPlataforma(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Udemy, Rocketseat, Alura..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tipo de Curso
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="GRADUACAO">Graduação</option>
                  <option value="POS_GRADUACAO">Pós-Graduação</option>
                  <option value="CURSO_LIVRE">Curso Livre</option>
                  <option value="CERTIFICACAO">Certificação</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-4"
              >
                Salvar Curso
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
