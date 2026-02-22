import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
export declare class AulaController {
    static create(req: AuthRequest, res: Response): Promise<any>;
    static listarPorDisciplina(req: AuthRequest, res: Response): Promise<any>;
    static atualizarStatus(req: AuthRequest, res: Response): Promise<any>;
}
//# sourceMappingURL=AulaController.d.ts.map