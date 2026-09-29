"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSessionToken, SESSION_COOKIE, sessionMaxAge } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = z.object({ password: z.string().min(1) }).safeParse({ password: formData.get("password") });
  const hash = process.env.APP_PASSWORD_HASH;
  if (!parsed.success || !hash || !(await bcrypt.compare(parsed.data.password, hash))) return { error: "Senha incorreta. Tente novamente." };
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: sessionMaxAge, path: "/" });
  redirect("/");
}
