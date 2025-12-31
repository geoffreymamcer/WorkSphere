import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { env } from "../config/env";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const adapter = new PrismaNeon({
      connectionString: env.DATABASE_URL,
    });

    return new PrismaClient({
      adapter,
      log:
        env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  })();

// 3. Save instance to global in development
if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
