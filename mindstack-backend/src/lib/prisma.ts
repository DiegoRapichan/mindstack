import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Pega a URL do banco do arquivo .env
const connectionString = `${process.env.DATABASE_URL}`;

// Cria o pool de conexão nativo do Postgres
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Inicia o Prisma usando o adapter
export const prisma = new PrismaClient({
  adapter,
  log: ["query", "error"],
});
