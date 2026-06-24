import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_PASSWORD, ADMIN_TOKEN } from "@/lib/admin";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = await req.json();
    password = body.password || "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
