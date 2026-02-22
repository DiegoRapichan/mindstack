import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UsuarioController {
  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;

      const usuarioExiste = await prisma.usuario.findUnique({
        where: { email },
      });
      if (usuarioExiste) {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }

      const hashSenha = await bcrypt.hash(senha, 10);

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: hashSenha,
        },
      });

      const { senha: _, ...usuarioSemSenha } = usuario;
      return res.status(201).json(usuarioSemSenha);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao registrar usuário." });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" },
      );

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
