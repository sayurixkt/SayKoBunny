"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { databaseDate } from "@/lib/dates";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const id = z.string().cuid();
function refresh(day: string) { revalidatePath(`/diario?date=${day}`); revalidatePath("/diario"); }
export async function addFoodLog(formData: FormData) { await requireAuth(); const day = date.parse(formData.get("date")); await prisma.foodLog.create({ data: { date: databaseDate(day), mealId: id.parse(formData.get("mealId")), portions: z.coerce.number().positive().max(20).parse(formData.get("portions")) } }); refresh(day); }
export async function addWater(formData: FormData) { await requireAuth(); const day = date.parse(formData.get("date")); await prisma.waterLog.create({ data: { date: databaseDate(day), milliliters: z.coerce.number().int().positive().max(10000).parse(formData.get("milliliters")) } }); refresh(day); }
export async function addBowel(formData: FormData) { await requireAuth(); const day = date.parse(formData.get("date")); const time = z.string().regex(/^\d{2}:\d{2}$/).parse(formData.get("time")); await prisma.bowelMovement.create({ data: { occurredAt: new Date(`${day}T${time}:00-03:00`) } }); refresh(day); }
export async function addExercise(formData: FormData) { await requireAuth(); const day = date.parse(formData.get("date")); await prisma.exerciseLog.create({ data: { date: databaseDate(day), activity: z.string().trim().min(2).max(120).parse(formData.get("activity")), durationMinutes: z.coerce.number().int().positive().max(1440).parse(formData.get("duration")), distanceKilometers: formData.get("distance") ? z.coerce.number().min(0).max(1000).parse(formData.get("distance")) : null, caloriesBurned: z.coerce.number().min(0).max(10000).parse(formData.get("calories")) } }); refresh(day); }
export async function deleteLog(formData: FormData) { await requireAuth(); const day = date.parse(formData.get("date")); const kind = z.enum(["food", "water", "bowel", "exercise"]).parse(formData.get("kind")); const logId = id.parse(formData.get("id")); if (kind === "food") await prisma.foodLog.delete({ where: { id: logId } }); if (kind === "water") await prisma.waterLog.delete({ where: { id: logId } }); if (kind === "bowel") await prisma.bowelMovement.delete({ where: { id: logId } }); if (kind === "exercise") await prisma.exerciseLog.delete({ where: { id: logId } }); refresh(day); }
