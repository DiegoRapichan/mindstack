import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BookOpen,
  Plus,
  FileText,
  X,
  CheckCircle,
  Clock,
  ListTodo,
} from "lucide-react";

interface Curso {
  id: string;
  titulo: string;
  plataforma: string;
}

interface Estatisticas {
  cards: {
    totalCursos: number;
    totalTarefas: number;
    concluidas: number;
    emAndamento: number;
    aFazer: number;
  };
  graficoStatus: { name: string; value: number; fill: string }[];
  graficoDisciplinas: { name: string; tarefas: number }[];
}

export function Dashboard() {
  const navigate = useNavigate();

  // Estados dos Cursos
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [tipo, setTipo] = useState("CURSO_LIVRE");

  // Estados das Estatísticas
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);

  const usuarioString = localStorage.getItem("@Mindstack:user");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  useEffect(() => {
    async function carregarDados() {
      try {
        // Carrega cursos e estatísticas ao mesmo tempo!
        const [resCursos, resStats] = await Promise.all([
          api.get("/cursos"),
          api.get("/dashboard"),
        ]);

        setCursos(resCursos.data);
        setEstatisticas(resStats.data);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    }
    carregarDados();
  }, []);

  function handleLogout() {
    localStorage.removeItem("@Mindstack:token");
    localStorage.removeItem("@Mindstack:user");
    navigate("/");
  }

  async function handleCriarCurso(e: React.FormEvent) {
    e.preventDefault();
    try {
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
      {/* 🔴 CABEÇALHO */}
      <header className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Mindstack</h1>
          <p className="text-gray-400">
            Bem-vindo(a),{" "}
            <span className="text-white font-medium">{usuario?.nome}</span>!
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/kanban")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Acessar Kanban
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Sair
          </button>
        </div>
      </header>
      {/* 🔴 SEÇÃO DE ESTATÍSTICAS E GRÁFICOS (Só aparece se o back-end retornar os dados) */}
      {estatisticas && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-300 mb-6">
            Visão Geral do seu Desempenho
          </h2>

          {/* CARDS DE RESUMO */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-blue-900/30 text-blue-500 rounded-xl">
                <ListTodo className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">
                  Total de Tarefas
                </p>
                <p className="text-3xl font-bold">
                  {estatisticas.cards.totalTarefas}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-green-900/30 text-green-500 rounded-xl">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Concluídas</p>
                <p className="text-3xl font-bold">
                  {estatisticas.cards.concluidas}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-yellow-900/30 text-yellow-500 rounded-xl">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">
                  Fazendo / A Fazer
                </p>
                <p className="text-3xl font-bold">
                  {estatisticas.cards.emAndamento + estatisticas.cards.aFazer}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-purple-900/30 text-purple-500 rounded-xl">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">
                  Cursos Ativos
                </p>
                <p className="text-3xl font-bold">
                  {estatisticas.cards.totalCursos}
                </p>
              </div>
            </div>
          </div>

          {/* GRÁFICOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-80">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm flex flex-col h-full">
              <h2 className="text-lg font-bold text-gray-200 mb-4">
                Status das Tarefas
              </h2>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estatisticas.graficoStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {estatisticas.graficoStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {estatisticas.graficoStatus.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    ></span>
                    {item.name} ({item.value})
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm flex flex-col h-full">
              <h2 className="text-lg font-bold text-gray-200 mb-4">
                Tarefas por Disciplina
              </h2>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={estatisticas.graficoDisciplinas}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#374151" }}
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="tarefas"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="w-full h-px bg-gray-700 my-8"></div>{" "}
      {/* Linha separadora */}
      {/* 🔴 SEÇÃO ORIGINAL: MEUS CURSOS */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-300">Meus Cursos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Novo Curso
        </button>
      </div>
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
      {/* 🔴 SEÇÃO ORIGINAL: MODAL DE CRIAR CURSO */}
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
