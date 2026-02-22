import { Request, Response } from "express";
import nodemailer from "nodemailer";

export class ContatoController {
  static async enviar(req: Request, res: Response): Promise<any> {
    try {
      const { nome, email, mensagem } = req.body;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Novo contato do Portfólio (Mindstack): ${nome}`,
        text: `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`,
      });

      return res.status(200).json({ message: "E-mail enviado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao enviar e-mail." });
    }
  }
}
