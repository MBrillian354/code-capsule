import { NextResponse } from "next/server";
import postgres from "postgres";
import { z } from "zod";
import type { User } from "@/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const BodySchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const token = request.headers.get("x-internal-token");
    const secret = process.env.NEXTAUTH_SECRET;
    const allowDevFallback = process.env.NODE_ENV !== "production" && !secret;
    if (!allowDevFallback) {
      if (!token || token !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const json = await request.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { email } = parsed.data;
    const rows = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
  const user = rows[0];
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Avoid sending sensitive fields you don't want leaked; but NextAuth expects password for comparison server-side.
    return NextResponse.json(user);
  } catch (err) {
    console.error("/api/users/by-email error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
