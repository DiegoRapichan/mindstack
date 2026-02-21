import "dotenv/config"; // ISSO DEVE SER A PRIMEIRA LINHA DO ARQUIVO! 🚨

import express from "express";
import cors from "cors";
import { usuarioRoutes } from "./routes/usuario.routes";
import { cursoRoutes } from "./routes/curso.routes";
import { resumoRoutes } from "./routes/resumo.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Registra as rotas principais
app.use("/auth", usuarioRoutes);
app.use("/cursos", cursoRoutes);
app.use("/resumos", resumoRoutes); // Aqui a mágica acontece e vai pro arquivo certo!

app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    message: "Servidor do Mindstack rodando! 🚀",
  });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () =>
  console.log(`🔥 Mindstack Backend rodando na porta ${PORT}`),
);
