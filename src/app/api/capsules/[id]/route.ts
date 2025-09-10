import { NextResponse } from "next/server";
import { getCapsuleWithUserProgress, getSession } from "@/lib/dal";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Optional auth: include progress if available.
    const session = await getSession();
    const userId = session.isAuth ? session.userId : null;

    const capsule = await getCapsuleWithUserProgress(id, userId);
    if (!capsule) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(capsule, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[GET /api/capsules/:id] Error:", error);
    return NextResponse.json({ error: "Failed to fetch capsule" }, { status: 500 });
  }
}
