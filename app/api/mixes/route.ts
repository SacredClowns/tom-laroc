import { NextResponse } from "next/server";
import { getMixes } from "@/lib/mixcloud";

// Tom's real Mixcloud catalog for the persistent player. Cached daily.
export const revalidate = 86400;

export async function GET() {
  const mixes = await getMixes();
  return NextResponse.json({ mixes });
}
