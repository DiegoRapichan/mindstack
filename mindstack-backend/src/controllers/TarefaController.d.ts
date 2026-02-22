import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
export declare class TarefaController {
    static criar(req: AuthRequest, res: Response): Promise<any>;
    static listar(req: AuthRequest, res: Response): Promise<any>;
    static atualizar(req: AuthRequest, res: Response): Promise<any>;
    static excluir(req: AuthRequest, res: Response): Promise<any>;
    static reordenar(req: AuthRequest, res: Response): Promise<any>;
}
//# sourceMappingURL=TarefaController.d.ts.map