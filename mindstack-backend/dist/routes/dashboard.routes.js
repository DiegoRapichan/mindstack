"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const DashboardController_1 = require("../controllers/DashboardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const dashboardRoutes = (0, express_1.Router)();
exports.dashboardRoutes = dashboardRoutes;
// Protege a rota com o middleware de autenticação
dashboardRoutes.use(authMiddleware_1.authMiddleware);
// Rota principal do dashboard
dashboardRoutes.get("/", DashboardController_1.DashboardController.getResumo);
