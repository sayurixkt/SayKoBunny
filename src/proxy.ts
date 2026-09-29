import { NextRequest, NextResponse } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/auth";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/login")) return NextResponse.next();
  if (!isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|favicon.ico).*)"] };
