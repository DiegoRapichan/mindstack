import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
export declare class DisciplinaController {
    static create(req: AuthRequest, res: Response): Promise<any>;
    static listarPorCurso(req: AuthRequest, res: Response): Promise<any>;
    static listarTodas(req: AuthRequest, res: Response): Promise<any>;
}
//# sourceMappingURL=DisciplinaController.d.ts.map