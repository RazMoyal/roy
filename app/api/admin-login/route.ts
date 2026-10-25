import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  checkCredentials,
  createSessionToken,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username ?? "";
  const password = body.password ?? "";

  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: "שם משתמש או סיסמה שגויים" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
