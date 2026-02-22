import { Request, Response } from "express";
export declare class UsuarioController {
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static atualizarPerfil(req: AuthRequest, res: Response): Promise<any>;
}
//# sourceMappingURL=UsuarioController.d.ts.map