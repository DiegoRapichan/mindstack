import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Isso é necessário porque o TypeScript não sabe que o "Request" padrão
// do Express pode receber um "usuarioId" que nós vamos injetar.
export interface AuthRequest extends Request {
  usuarioId?: string;
}

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  // O token vem no cabeçalho (Header) da requisição, na propriedade "Authorization"
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  // O formato padrão é "Bearer token_gigante_aqui". Vamos separar a string:
  const [, token] = authHeader.split(" ");

  try {
    // Tenta decodificar o token usando a mesma senha mestre do .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Se deu certo, extraímos o ID do usuário que estava guardado dentro do token
    const { id } = decoded as TokenPayload;

    // Injetamos o ID do usuário na requisição.
    // Assim, o próximo código (o Controller de Cursos, por exemplo) vai saber EXATAMENTE quem está logado!
    req.usuarioId = id;

    // Manda a requisição seguir em frente (entrar na rota)
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}
