import { NextResponse } from "next/server";
import { CreateByUrlSchema } from "@/lib/validators";
import { requireUserId } from "@server/auth/session";
import { createCapsuleFromUrlService } from "@server/services/capsules.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateByUrlSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
    }

  const userId = await requireUserId()
  const result = await createCapsuleFromUrlService({ url: parsed.data.url, userId })
    if (!('ok' in result) || result.ok !== true) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error("[Create capsule by URL] Error:", err);
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
