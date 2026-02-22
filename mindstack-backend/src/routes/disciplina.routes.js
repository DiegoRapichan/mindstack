"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disciplinaRoutes = void 0;
const express_1 = require("express");
const DisciplinaController_1 = require("../controllers/DisciplinaController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const disciplinaRoutes = (0, express_1.Router)();
exports.disciplinaRoutes = disciplinaRoutes;
disciplinaRoutes.use(authMiddleware_1.authMiddleware);
disciplinaRoutes.get("/", DisciplinaController_1.DisciplinaController.listarTodas);
disciplinaRoutes.post("/", DisciplinaController_1.DisciplinaController.create);
disciplinaRoutes.get("/curso/:cursoId", DisciplinaController_1.DisciplinaController.listarPorCurso);
//# sourceMappingURL=disciplina.routes.js.map