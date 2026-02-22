import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
export declare const prisma: PrismaClient<{
    adapter: PrismaPg;
    log: ("query" | "error")[];
}, "query" | "error", import("@prisma/client/runtime/library").DefaultArgs>;
//# sourceMappingURL=prisma.d.ts.map