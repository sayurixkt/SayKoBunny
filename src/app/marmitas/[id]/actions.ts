"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

const grams = z.coerce.number().positive().max(5000);
const id = z.string().cuid();
function paths(mealId: string) { revalidatePath(`/marmitas/${mealId}`); revalidatePath("/marmitas"); }

export async function addItem(formData: FormData) { await requireAuth(); const mealId = id.parse(formData.get("mealId")); await prisma.mealItem.create({ data: { mealId, foodId: id.parse(formData.get("foodId")), grams: grams.parse(formData.get("grams")) } }); paths(mealId); }
export async function changeGrams(formData: FormData) { await requireAuth(); const mealId = id.parse(formData.get("mealId")); await prisma.mealItem.update({ where: { id: id.parse(formData.get("itemId")) }, data: { grams: grams.parse(formData.get("grams")) } }); paths(mealId); }
export async function removeItem(formData: FormData) { await requireAuth(); const mealId = id.parse(formData.get("mealId")); await prisma.mealItem.delete({ where: { id: id.parse(formData.get("itemId")) } }); paths(mealId); }
export async function updateMeal(formData: FormData) { await requireAuth(); const mealId = id.parse(formData.get("mealId")); await prisma.meal.update({ where: { id: mealId }, data: { name: z.string().trim().min(2).max(120).parse(formData.get("name")), description: z.string().trim().max(500).parse(formData.get("description")) || null } }); paths(mealId); }
