import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/store";

export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = (body.email || "").trim();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Valid email required." },
      { status: 422 }
    );
  }

  try {
    await addSubscriber(email);
  } catch (e) {
    console.error("subscriber persist failed:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
