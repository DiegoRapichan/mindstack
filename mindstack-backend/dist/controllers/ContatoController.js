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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContatoController = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class ContatoController {
    static enviar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, email, mensagem } = req.body;
                const transporter = nodemailer_1.default.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
                yield transporter.sendMail({
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
        });
    }
}
exports.ContatoController = ContatoController;
