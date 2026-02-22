"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoController = void 0;
const prisma_1 = require("../lib/prisma");
class CursoController {
    // 1. Criar um novo curso (agora com static)
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { titulo, plataforma, tipo } = req.body;
                if (!titulo || !plataforma || !tipo) {
                    return res
                        .status(400)
                        .json({ error: "Preencha todos os campos obrigatórios." });
                }
                const curso = yield prisma_1.prisma.curso.create({
                    data: {
                        titulo,
                        plataforma,
                        tipo,
                        status: "EM_ANDAMENTO",
                        usuarioId: req.usuarioId,
                    },
                });
                return res.status(201).json(curso);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erro ao criar curso." });
            }
        });
    }
    // 2. Listar os cursos do usuário logado (agora com static e createdAt)
    static list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioId = req.usuarioId;
                if (!usuarioId) {
                    return res.status(401).json({ error: "Usuário não autenticado." });
                }
                const cursos = yield prisma_1.prisma.curso.findMany({
                    where: {
                        usuarioId,
                    },
                    orderBy: {
                        createdAt: "desc", // <--- CORRIGIDO AQUI! Ordena pela data de criação
                    },
                });
                return res.status(200).json(cursos);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erro ao buscar cursos." });
            }
        });
    }
}
exports.CursoController = CursoController;
