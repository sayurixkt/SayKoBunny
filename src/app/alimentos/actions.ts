"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

const foodSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome com pelo menos 2 caracteres.").max(120),
  calories: z.coerce.number().min(0, "Não use valores negativos."),
  protein: z.coerce.number().min(0, "Não use valores negativos."),
  carbs: z.coerce.number().min(0, "Não use valores negativos."),
  fat: z.coerce.number().min(0, "Não use valores negativos."),
});

function payload(formData: FormData) {
  return foodSchema.parse({
    name: formData.get("name"), calories: formData.get("calories"), protein: formData.get("protein"),
    carbs: formData.get("carbs"), fat: formData.get("fat"),
  });
}

export async function createFood(formData: FormData) {
  await requireAuth();
  const data = payload(formData);
  await prisma.food.create({ data });
  revalidatePath("/alimentos");
  redirect("/alimentos");
}

export async function updateFood(formData: FormData) {
  await requireAuth();
  const id = z.string().cuid().parse(formData.get("id"));
  await prisma.food.update({ where: { id }, data: payload(formData) });
  revalidatePath("/alimentos");
  redirect("/alimentos");
}

export async function toggleFood(formData: FormData) {
  await requireAuth();
  const id = z.string().cuid().parse(formData.get("id"));
  const active = z.coerce.boolean().parse(formData.get("active"));
  await prisma.food.update({ where: { id }, data: { active } });
  revalidatePath("/alimentos");
}
