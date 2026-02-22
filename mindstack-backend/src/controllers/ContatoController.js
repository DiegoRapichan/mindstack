"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContatoController = void 0;
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
class ContatoController {
    static async enviar(req, res) {
        try {
            const { nome, email, mensagem } = req.body;
            const transporter = nodemailer_1.default.createTransport({
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
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao enviar e-mail." });
        }
    }
}
exports.ContatoController = ContatoController;
//# sourceMappingURL=ContatoController.js.map