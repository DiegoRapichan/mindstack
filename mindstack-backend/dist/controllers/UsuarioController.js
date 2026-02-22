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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UsuarioController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, email, senha } = req.body;
                const usuarioExiste = yield prisma_1.prisma.usuario.findUnique({
                    where: { email },
                });
                if (usuarioExiste) {
                    return res.status(400).json({ error: "E-mail já cadastrado." });
                }
                const hashSenha = yield bcryptjs_1.default.hash(senha, 10);
                const usuario = yield prisma_1.prisma.usuario.create({
                    data: {
                        nome,
                        email,
                        senha: hashSenha,
                    },
                });
                const { senha: _ } = usuario, usuarioSemSenha = __rest(usuario, ["senha"]);
                return res.status(201).json(usuarioSemSenha);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erro ao registrar usuário." });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, senha } = req.body;
                const usuario = yield prisma_1.prisma.usuario.findUnique({ where: { email } });
                if (!usuario) {
                    return res.status(401).json({ error: "E-mail ou senha incorretos." });
                }
                const senhaValida = yield bcryptjs_1.default.compare(senha, usuario.senha);
                if (!senhaValida) {
                    return res.status(401).json({ error: "E-mail ou senha incorretos." });
                }
                const token = jsonwebtoken_1.default.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
                const { senha: _ } = usuario, usuarioSemSenha = __rest(usuario, ["senha"]);
                return res.json({
                    usuario: usuarioSemSenha,
                    token,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erro ao fazer login." });
            }
        });
    }
    static atualizarPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioId = req.usuarioId;
                const { nome, email, senhaAtual, novaSenha } = req.body;
                // Busca o usuário no banco
                const usuario = yield prisma_1.prisma.usuario.findUnique({
                    where: { id: usuarioId },
                });
                if (!usuario) {
                    return res.status(404).json({ error: "Usuário não encontrado." });
                }
                // Prepara os dados que vão ser atualizados
                const dadosAtualizacao = { nome, email };
                // Se o usuário mandou uma nova senha, precisamos validar a antiga
                if (novaSenha) {
                    if (!senhaAtual) {
                        return res
                            .status(400)
                            .json({ error: "Informe a senha atual para alterar a senha." });
                    }
                    const senhaValida = yield bcryptjs_1.default.compare(senhaAtual, usuario.senha);
                    if (!senhaValida) {
                        return res.status(400).json({ error: "Senha atual incorreta." });
                    }
                    // Criptografa a nova senha antes de salvar
                    dadosAtualizacao.senha = yield bcryptjs_1.default.hash(novaSenha, 10);
                }
                // Salva no banco
                const usuarioAtualizado = yield prisma_1.prisma.usuario.update({
                    where: { id: usuarioId },
                    data: dadosAtualizacao,
                });
                // Retorna os dados novos (sem a senha, por segurança)
                return res.json({
                    id: usuarioAtualizado.id,
                    nome: usuarioAtualizado.nome,
                    email: usuarioAtualizado.email,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erro ao atualizar perfil." });
            }
        });
    }
}
exports.UsuarioController = UsuarioController;
