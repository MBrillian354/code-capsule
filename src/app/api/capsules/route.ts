import { NextRequest, NextResponse } from "next/server";
import { getAllPublicCapsulesWithUserProgress, getSession } from "@/lib/dal";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawLimit = Number(searchParams.get("limit"));
    const rawOffset = Number(searchParams.get("offset"));

    const limit = clamp(Number.isFinite(rawLimit) ? rawLimit : 20, 1, 50);
    const offset = clamp(Number.isFinite(rawOffset) ? rawOffset : 0, 0, 10_000);

    // Optional auth: include user progress when available, but endpoint is public.
    const session = await getSession();
    const userId = session.isAuth ? session.userId : null;

    const items = await getAllPublicCapsulesWithUserProgress(userId, limit, offset);

    return NextResponse.json(
      {
        items,
        pagination: { limit, offset, count: items.length },
      },
      {
        headers: {
          // Public cache with short TTL; adjust as needed.
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("[GET /api/capsules] Error:", error);
    return NextResponse.json({ error: "Failed to fetch capsules" }, { status: 500 });
  }
}
