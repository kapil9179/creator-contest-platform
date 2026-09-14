import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import envconfig from "../env/env.config.js";

const adapter = new PrismaPg({
  connectionString: envconfig.dburi,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;










