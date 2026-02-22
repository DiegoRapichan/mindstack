import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { CursoDetalhe } from "./pages/CursoDetalhe";
import { DisciplinaDetalhe } from "./pages/DisciplinaDetalhe";
import { Kanban } from "./pages/Kanban";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Configuracoes } from "./pages/Configuracoes";
import type { ReactNode } from "react";

function RotaPrivada({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("@Mindstack:token");
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
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
          <Route path="/kanban" element={<Kanban />} />

          <Route
            path="/disciplina/:disciplinaId"
            element={
              <RotaPrivada>
                <DisciplinaDetalhe />
              </RotaPrivada>
            }
          />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
