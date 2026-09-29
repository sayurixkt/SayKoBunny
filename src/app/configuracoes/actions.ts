"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { databaseDate } from "@/lib/dates";

const number = z.coerce.number().min(0).max(10000);
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export async function saveGoals(formData: FormData) {
  await requireAuth();
  await prisma.dailyGoals.upsert({
    where: { id: "default" },
    update: { calories: number.parse(formData.get("calories")), protein: number.parse(formData.get("protein")), carbs: number.parse(formData.get("carbs")), fat: number.parse(formData.get("fat")), waterMl: z.coerce.number().int().positive().max(20000).parse(formData.get("waterMl")) },
    create: { id: "default", calories: number.parse(formData.get("calories")), protein: number.parse(formData.get("protein")), carbs: number.parse(formData.get("carbs")), fat: number.parse(formData.get("fat")), waterMl: z.coerce.number().int().positive().max(20000).parse(formData.get("waterMl")) },
  });
  revalidatePath("/configuracoes"); revalidatePath("/diario");
}

export async function saveBasalRate(formData: FormData) {
  await requireAuth();
  const effectiveDate = day.parse(formData.get("effectiveDate"));
  await prisma.basalRate.upsert({ where: { effectiveDate: databaseDate(effectiveDate) }, update: { calories: number.parse(formData.get("calories")) }, create: { effectiveDate: databaseDate(effectiveDate), calories: number.parse(formData.get("calories")) } });
  revalidatePath("/configuracoes"); revalidatePath("/diario");
}

export async function deleteBasalRate(formData: FormData) {
  await requireAuth();
  await prisma.basalRate.delete({ where: { id: z.string().cuid().parse(formData.get("id")) } });
  revalidatePath("/configuracoes"); revalidatePath("/diario");
}
