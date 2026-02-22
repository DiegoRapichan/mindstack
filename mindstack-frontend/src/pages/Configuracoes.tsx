import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, Save, User, Mail, Lock } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function Configuracoes() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    // Carrega os dados que estão salvos no localStorage para preencher os inputs
    const usuarioString = localStorage.getItem("@Mindstack:user");
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      setNome(usuario.nome);
      setEmail(usuario.email);
    }
  }, []);

  async function handleSalvarPerfil(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);

    try {
      const payload = { nome, email, senhaAtual, novaSenha };
      const response = await api.put("/auth/perfil", payload);

      // Atualiza o localStorage com o novo nome/email para refletir em todo o site
      localStorage.setItem("@Mindstack:user", JSON.stringify(response.data));

      alert("Perfil atualizado com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      navigate("/dashboard"); // Volta pro dashboard após salvar
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao atualizar perfil.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      className={`min-h-screen p-4 md:p-8 flex justify-center items-center transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div
        className={`w-full max-w-xl rounded-2xl shadow-xl p-6 md:p-8 border transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <header className="flex items-center gap-4 mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              Configurações
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Atualize seus dados pessoais e senha
            </p>
          </div>
        </header>

        <form onSubmit={handleSalvarPerfil} className="space-y-6">
          {/* NOME */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Nome Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* E-MAIL */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              Segurança (Opcional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SENHA ATUAL */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Senha Atual
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Para alterar a senha"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* NOVA SENHA */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Sua nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mt-6 shadow-lg shadow-blue-500/30 disabled:opacity-70"
          >
            {salvando ? (
              "Salvando..."
            ) : (
              <>
                <Save className="w-5 h-5" /> Salvar Alterações
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
