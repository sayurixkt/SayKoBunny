"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { activePasswordHash } from "@/lib/password";

export type PasswordState = { error?: string; success?: string };

export async function changePassword(_: PasswordState, formData: FormData): Promise<PasswordState> {
  await requireAuth();
  const parsed = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(10, "Use pelo menos 10 caracteres."), confirmation: z.string() }).safeParse({ currentPassword: formData.get("currentPassword"), newPassword: formData.get("newPassword"), confirmation: formData.get("confirmation") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Confira os campos." };
  if (parsed.data.newPassword !== parsed.data.confirmation) return { error: "A confirmação não corresponde à nova senha." };
  const currentHash = await activePasswordHash();
  if (!currentHash || !(await bcrypt.compare(parsed.data.currentPassword, currentHash))) return { error: "A senha atual está incorreta." };
  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.appSettings.upsert({ where: { id: "default" }, update: { passwordHash }, create: { id: "default", passwordHash } });
  return { success: "Senha alterada com sucesso." };
}
