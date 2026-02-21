import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UsuarioController {
  // 1. Rota de Cadastro (Register)
  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;

      // Verifica se o e-mail já existe no banco
      const usuarioExiste = await prisma.usuario.findUnique({
        where: { email },
      });
      if (usuarioExiste) {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }

      // Criptografa a senha (Hash) antes de salvar
      const hashSenha = await bcrypt.hash(senha, 10);

      // Salva no banco de dados usando o Prisma
      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: hashSenha,
        },
      });

      // Retorna os dados, mas esconde a senha por segurança
      const { senha: _, ...usuarioSemSenha } = usuario;
      return res.status(201).json(usuarioSemSenha);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao registrar usuário." });
    }
  }

  // 2. Rota de Autenticação (Login)
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      // Busca o usuário pelo e-mail
      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      // Compara a senha que o cara digitou com o Hash salvo no banco
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      // Gera o Token JWT (válido por 7 dias)
      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" },
      );

      // Esconde a senha e devolve o Token
      const { senha: _, ...usuarioSemSenha } = usuario;
      return res.json({
        usuario: usuarioSemSenha,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao fazer login." });
    }
  }
}
