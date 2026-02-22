"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Vamos guardar o PDF temporariamente na memória RAM do servidor
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        // Só aceita arquivos do tipo PDF
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        }
        else {
            cb(new Error("Apenas arquivos PDF são aceitos."));
        }
    },
});
