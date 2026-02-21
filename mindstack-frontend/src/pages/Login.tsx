import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Adicione este import
import { api } from "../services/api";
import { BrainCircuit, Mail, Lock } from "lucide-react";

export function Login() {
  const navigate = useNavigate(); // 2. ADICIONE ESTA LINHA AQUI! (Tem que ser logo no começo da função)

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isCadastro, setIsCadastro] = useState(false);
  const [nome, setNome] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (isCadastro) {
        // Rota de cadastro
        await api.post("/auth/register", { nome, email, senha });
        alert("Cadastro realizado com sucesso! Agora faça o login.");
        setIsCadastro(false);
      } else {
        // Rota de login
        const response = await api.post("/auth/login", { email, senha });
        const { token, usuario } = response.data;

        // Salvamos o token no navegador
        localStorage.setItem("@Mindstack:token", token);
        localStorage.setItem("@Mindstack:user", JSON.stringify(usuario));

        // 3. E aqui a gente usa o navigate!
        navigate("/dashboard");
      }
    } catch (error) {
      alert(
        "Erro na requisição. Verifique os dados ou se o backend está rodando!",
      );
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-500 p-3 rounded-full mb-4">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Mindstack</h1>
          <p className="text-gray-400 mt-2">
            {isCadastro
              ? "Crie sua conta para começar"
              : "Acesse sua conta para continuar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isCadastro && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Seu nome completo"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-6"
          >
            {isCadastro ? "Criar Conta" : "Entrar no Sistema"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {isCadastro ? "Já tem uma conta?" : "Ainda não tem uma conta?"}
          <button
            onClick={() => setIsCadastro(!isCadastro)}
            className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
          >
            {isCadastro ? "Faça login" : "Cadastre-se"}
          </button>
        </p>
      </div>
    </div>
  );
}
