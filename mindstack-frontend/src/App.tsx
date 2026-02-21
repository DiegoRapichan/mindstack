import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { CursoDetalhe } from "./pages/CursoDetalhe";

// Função simples para proteger rotas: só entra se tiver token!
function RotaPrivada({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("@Mindstack:token");
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RotaPrivada>
              <Dashboard />
            </RotaPrivada>
          }
        />
        <Route
          path="/curso/:cursoId"
          element={
            <RotaPrivada>
              <CursoDetalhe />
            </RotaPrivada>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
