"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UsuarioController {
    async register(req, res) {
        try {
            const { nome, email, senha } = req.body;
            const usuarioExiste = await prisma_1.prisma.usuario.findUnique({
                where: { email },
            });
            if (usuarioExiste) {
                return res.status(400).json({ error: "E-mail já cadastrado." });
            }
            const hashSenha = await bcryptjs_1.default.hash(senha, 10);
            const usuario = await prisma_1.prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha: hashSenha,
                },
            });
            const { senha: _, ...usuarioSemSenha } = usuario;
            return res.status(201).json(usuarioSemSenha);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao registrar usuário." });
        }
    }
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const usuario = await prisma_1.prisma.usuario.findUnique({ where: { email } });
            if (!usuario) {
                return res.status(401).json({ error: "E-mail ou senha incorretos." });
            }
            const senhaValida = await bcryptjs_1.default.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ error: "E-mail ou senha incorretos." });
            }
            const token = jsonwebtoken_1.default.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
            const { senha: _, ...usuarioSemSenha } = usuario;
            return res.json({
                usuario: usuarioSemSenha,
                token,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao fazer login." });
        }
    }
    static async atualizarPerfil(req, res) {
        try {
            const usuarioId = req.usuarioId;
            const { nome, email, senhaAtual, novaSenha } = req.body;
            // Busca o usuário no banco
            const usuario = await prisma_1.prisma.usuario.findUnique({
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
                const senhaValida = await bcryptjs_1.default.compare(senhaAtual, usuario.senha);
                if (!senhaValida) {
                    return res.status(400).json({ error: "Senha atual incorreta." });
                }
                // Criptografa a nova senha antes de salvar
                dadosAtualizacao.senha = await bcryptjs_1.default.hash(novaSenha, 10);
            }
            // Salva no banco
            const usuarioAtualizado = await prisma_1.prisma.usuario.update({
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
    }
}
exports.UsuarioController = UsuarioController;
//# sourceMappingURL=UsuarioController.js.map