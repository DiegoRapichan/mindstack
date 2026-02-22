import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    usuarioId?: string;
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
//# sourceMappingURL=authMiddleware.d.ts.map