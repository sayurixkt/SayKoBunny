import "server-only";
import { prisma } from "@/lib/prisma";

export async function activePasswordHash() {
  const settings = await prisma.appSettings.findUnique({ where: { id: "default" }, select: { passwordHash: true } });
  return settings?.passwordHash ?? process.env.APP_PASSWORD_HASH;
}
