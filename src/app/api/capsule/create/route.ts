import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    // Log the URL received from the frontend
    console.log("[Create capsule by URL] URL received:", url);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Create capsule by URL] Error parsing request:", err);
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
