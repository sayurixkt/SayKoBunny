"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

const mealSchema = z.object({ name: z.string().trim().min(2).max(120), description: z.string().trim().max(500).optional() });

export async function createMeal(formData: FormData) {
  await requireAuth(); const data = mealSchema.parse({ name: formData.get("name"), description: formData.get("description") || undefined });
  const meal = await prisma.meal.create({ data }); redirect(`/marmitas/${meal.id}`);
}
export async function archiveMeal(formData: FormData) {
  await requireAuth(); const id = z.string().cuid().parse(formData.get("id")); const archived = z.coerce.boolean().parse(formData.get("archived"));
  await prisma.meal.update({ where: { id }, data: { archived } }); revalidatePath("/marmitas");
}
export async function duplicateMeal(formData: FormData) {
  await requireAuth(); const id = z.string().cuid().parse(formData.get("id"));
  const original = await prisma.meal.findUniqueOrThrow({ where: { id }, include: { items: true } });
  const copy = await prisma.meal.create({ data: { name: `${original.name} (cópia)`, description: original.description, items: { create: original.items.map((item) => ({ foodId: item.foodId, grams: item.grams })) } } });
  redirect(`/marmitas/${copy.id}`);
}
