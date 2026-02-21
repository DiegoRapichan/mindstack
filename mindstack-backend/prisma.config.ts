import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

// Força o Node.js a ler o arquivo .env IMEDIATAMENTE
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
