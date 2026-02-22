import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
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
  Sun,
  Moon,
  Github,
  Linkedin,
  Mail,
  Send,
  Settings,
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
  graficoProdutividade: { data: string; concluidas: number }[];
}

export function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [tipo, setTipo] = useState("CURSO_LIVRE");

  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);

  // ESTADOS DO MODAL DE CONTATO
  const [isContatoModalOpen, setIsContatoModalOpen] = useState(false);
  const [contatoNome, setContatoNome] = useState("");
  const [contatoEmail, setContatoEmail] = useState("");
  const [contatoMensagem, setContatoMensagem] = useState("");
  const [enviandoContato, setEnviandoContato] = useState(false);

  const usuarioString = localStorage.getItem("@Mindstack:user");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resCursos, resStats] = await Promise.all([
          api.get("/cursos"),
          api.get("/dashboard"),
        ]);

        setCursos(resCursos.data);
        setEstatisticas(resStats.data);
      } catch (error) {
        console.error(error);
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
      alert("Erro ao criar o curso.");
    }
  }

  // FUNÇÃO DE ENVIAR CONTATO
  async function handleEnviarContato(e: React.FormEvent) {
    e.preventDefault();
    setEnviandoContato(true);
    try {
      await api.post("/contato", {
        nome: contatoNome,
        email: contatoEmail,
        mensagem: contatoMensagem,
      });
      alert("Mensagem enviada com sucesso!");
      setIsContatoModalOpen(false);
      setContatoNome("");
      setContatoEmail("");
      setContatoMensagem("");
    } catch (error) {
      alert("Erro ao enviar mensagem. Verifique a configuração do servidor.");
    } finally {
      setEnviandoContato(false);
    }
  }

  const tooltipStyle =
    theme === "dark"
      ? {
          backgroundColor: "#1F2937",
          borderColor: "#374151",
          color: "#fff",
          borderRadius: "8px",
        }
      : {
          backgroundColor: "#ffffff",
          borderColor: "#e5e7eb",
          color: "#111827",
          borderRadius: "8px",
        };

  const axisColor = theme === "dark" ? "#9CA3AF" : "#6B7280";

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 bg-gray-50 dark:text-white text-gray-900 flex flex-col">
      <div className="flex-grow p-8">
        <header className="flex flex-col md:flex-row justify-between items-center dark:bg-gray-800 bg-white p-6 rounded-2xl shadow-lg border dark:border-gray-700 border-gray-200 mb-8 transition-colors duration-300">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              Mindstack
            </h1>
            <p className="dark:text-gray-400 text-gray-500">
              Bem-vindo(a),{" "}
              <span className="dark:text-white text-gray-900 font-medium">
                {usuario?.nome}
              </span>
              !
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg dark:bg-gray-700 bg-gray-100 dark:text-yellow-400 text-blue-600 hover:opacity-80 transition-colors"
              title={
                theme === "dark"
                  ? "Mudar para Modo Claro"
                  : "Mudar para Modo Escuro"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => navigate("/kanban")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-md shadow-blue-500/20"
            >
              Acessar Kanban
            </button>

            <button
              onClick={() => navigate("/configuracoes")}
              className="p-2 rounded-lg dark:bg-gray-700 bg-gray-100 dark:text-gray-300 text-gray-600 hover:opacity-80 transition-colors"
              title="Configurações do Perfil"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={handleLogout}
              className="dark:bg-red-500/10 bg-red-50 dark:text-red-500 text-red-600 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Sair
            </button>
          </div>
        </header>

        {estatisticas && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold dark:text-gray-300 text-gray-700 mb-6">
              Visão Geral do seu Desempenho
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="dark:bg-gray-800 bg-white p-6 rounded-2xl border dark:border-gray-700 border-gray-200 shadow-sm flex items-center gap-4 transition-colors duration-300">
                <div className="p-4 dark:bg-blue-900/30 bg-blue-100 text-blue-600 dark:text-blue-500 rounded-xl">
                  <ListTodo className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm dark:text-gray-400 text-gray-500 font-medium">
                    Total de Tarefas
                  </p>
                  <p className="text-3xl font-bold">
                    {estatisticas.cards.totalTarefas}
                  </p>
                </div>
              </div>

              <div className="dark:bg-gray-800 bg-white p-6 rounded-2xl border dark:border-gray-700 border-gray-200 shadow-sm flex items-center gap-4 transition-colors duration-300">
                <div className="p-4 dark:bg-green-900/30 bg-green-100 text-green-600 dark:text-green-500 rounded-xl">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm dark:text-gray-400 text-gray-500 font-medium">
                    Concluídas
                  </p>
                  <p className="text-3xl font-bold">
                    {estatisticas.cards.concluidas}
                  </p>
                </div>
              </div>

              <div className="dark:bg-gray-800 bg-white p-6 rounded-2xl border dark:border-gray-700 border-gray-200 shadow-sm flex items-center gap-4 transition-colors duration-300">
                <div className="p-4 dark:bg-yellow-900/30 bg-yellow-100 text-yellow-600 dark:text-yellow-500 rounded-xl">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm dark:text-gray-400 text-gray-500 font-medium">
                    Fazendo / A Fazer
                  </p>
                  <p className="text-3xl font-bold">
                    {estatisticas.cards.emAndamento + estatisticas.cards.aFazer}
                  </p>
                </div>
              </div>

              <div className="dark:bg-gray-800 bg-white p-6 rounded-2xl border dark:border-gray-700 border-gray-200 shadow-sm flex items-center gap-4 transition-colors duration-300">
                <div className="p-4 dark:bg-purple-900/30 bg-purple-100 text-purple-600 dark:text-purple-500 rounded-xl">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm dark:text-gray-400 text-gray-500 font-medium">
                    Cursos Ativos
                  </p>
                  <p className="text-3xl font-bold">
                    {estatisticas.cards.totalCursos}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-80 mb-8">
              <div className="dark:bg-gray-800 bg-white p-6 rounded-2xl border dark:border-gray-700 border-gray-200 shadow-sm flex flex-col h-full transition-colors duration-300">
                <h2 className="text-lg font-bold dark:text-gray-200 text-gray-800 mb-4">
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
                        contentStyle={tooltipStyle}
                        itemStyle={{
                          color: theme === "dark" ? "#fff" : "#111827",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {estatisticas.graficoStatus.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 text-sm dark:text-gray-300 text-gray-600"
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

              <div className="dark:bg-gray-800 bg-white p-6 rounded-2xl border dark:border-gray-700 border-gray-200 shadow-sm flex flex-col h-full transition-colors duration-300">
                <h2 className="text-lg font-bold dark:text-gray-200 text-gray-800 mb-4">
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
                        stroke={axisColor}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke={axisColor}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        cursor={{
                          fill: theme === "dark" ? "#374151" : "#f3f4f6",
                        }}
                        contentStyle={tooltipStyle}
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

            <div className="dark:bg-gray-800 bg-white p-6 rounded-2xl border dark:border-gray-700 border-gray-200 shadow-sm flex flex-col h-80 transition-colors duration-300">
              <h2 className="text-lg font-bold dark:text-gray-200 text-gray-800 mb-4">
                Tarefas Concluídas (Últimos 7 dias)
              </h2>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={estatisticas.graficoProdutividade}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="data"
                      stroke={axisColor}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={axisColor}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="concluidas"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#10B981",
                        strokeWidth: 2,
                        stroke: theme === "dark" ? "#1F2937" : "#ffffff",
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        <div className="w-full h-px dark:bg-gray-700 bg-gray-200 my-8 transition-colors duration-300"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold dark:text-gray-300 text-gray-700">
            Meus Cursos
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" /> Novo Curso
          </button>
        </div>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cursos.length === 0 ? (
            <div className="col-span-1 md:col-span-3 dark:bg-gray-800 bg-white p-8 rounded-2xl border dark:border-gray-700 border-gray-200 border-dashed flex flex-col items-center justify-center text-center h-64 transition-colors duration-300">
              <BookOpen className="w-12 h-12 dark:text-gray-500 text-gray-400 mb-4" />
              <p className="dark:text-gray-400 text-gray-500">
                Você ainda não tem cursos cadastrados.
              </p>
            </div>
          ) : (
            cursos.map((curso) => (
              <div
                key={curso.id}
                className="dark:bg-gray-800 bg-white p-6 rounded-2xl border dark:border-gray-700 border-gray-200 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="dark:bg-blue-500/20 bg-blue-100 p-3 rounded-lg group-hover:bg-blue-500/30 dark:group-hover:bg-blue-500/30 transition-colors">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-1">
                  {curso.titulo}
                </h3>
                <p className="dark:text-gray-400 text-gray-500 text-sm mb-6">
                  {curso.plataforma}
                </p>
                <button
                  onClick={() => navigate(`/curso/${curso.id}`)}
                  className="w-full flex items-center justify-center gap-2 dark:bg-gray-700 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" /> Acessar Matérias
                </button>
              </div>
            ))
          )}
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
            <div className="dark:bg-gray-800 bg-white rounded-2xl p-6 w-full max-w-md border dark:border-gray-700 border-gray-200 shadow-2xl transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold dark:text-white text-gray-900">
                  Cadastrar Novo Curso
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="dark:text-gray-400 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCriarCurso} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                    Título do Curso
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 rounded-lg px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                    Plataforma
                  </label>
                  <input
                    type="text"
                    value={plataforma}
                    onChange={(e) => setPlataforma(e.target.value)}
                    className="w-full dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 rounded-lg px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                    Tipo de Curso
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 rounded-lg px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="GRADUACAO">Graduação</option>
                    <option value="POS_GRADUACAO">Pós-Graduação</option>
                    <option value="CURSO_LIVRE">Curso Livre</option>
                    <option value="CERTIFICACAO">Certificação</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-4 shadow-md shadow-blue-500/20"
                >
                  Salvar Curso
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE CONTATO ADICIONADO AQUI! */}
        {isContatoModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
            <div className="dark:bg-gray-800 bg-white rounded-2xl p-6 w-full max-w-md border dark:border-gray-700 border-gray-200 shadow-2xl transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold dark:text-white text-gray-900">
                  Entre em Contato
                </h2>
                <button
                  onClick={() => setIsContatoModalOpen(false)}
                  className="dark:text-gray-400 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEnviarContato} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={contatoNome}
                    onChange={(e) => setContatoNome(e.target.value)}
                    className="w-full dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 rounded-lg px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                    Seu E-mail
                  </label>
                  <input
                    type="email"
                    value={contatoEmail}
                    onChange={(e) => setContatoEmail(e.target.value)}
                    className="w-full dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 rounded-lg px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    value={contatoMensagem}
                    onChange={(e) => setContatoMensagem(e.target.value)}
                    rows={4}
                    className="w-full dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 rounded-lg px-4 py-2 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={enviandoContato}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium py-2.5 rounded-lg transition-colors mt-4 shadow-md shadow-blue-500/20"
                >
                  {enviandoContato ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <footer className="w-full dark:bg-gray-900 bg-white border-t dark:border-gray-800 border-gray-200 py-8 transition-colors duration-300 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Mindstack
            </span>
            <p className="text-sm dark:text-gray-400 text-gray-500 mt-1 text-center md:text-left">
              Organize seus estudos. Acelere seu aprendizado.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-sm dark:text-gray-400 text-gray-500">
              Desenvolvido por{" "}
              <span className="font-semibold dark:text-gray-200 text-gray-800">
                Diego Colombari Rapichan
              </span>
            </p>
            <p className="text-xs dark:text-gray-500 text-gray-400 mt-1 font-medium px-3 py-1 dark:bg-gray-800 bg-gray-100 rounded-full">
              Desenvolvedor Full-Stack
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://github.com/DiegoRapichan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/diego-rapichan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            {/* BOTÃO QUE ABRE O MODAL */}
            <button
              onClick={() => setIsContatoModalOpen(true)}
              className="p-2 rounded-full dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              title="Enviar E-mail"
            >
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
