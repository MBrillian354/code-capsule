import { NextRequest, NextResponse } from "next/server";
import { upsertUserCapsule, getSession } from "@/lib/dal";
import { z } from "zod";
import { UpdateProgressSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
    try {
        // Verify session
        const session = await getSession();
        if (!session.isAuth || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const validatedData = UpdateProgressSchema.parse(body);

        // Update user capsule progress
        await upsertUserCapsule({
            userId: session.userId,
            capsuleId: validatedData.capsuleId,
            lastPageRead: validatedData.lastPageRead ?? null,
            overallProgress: validatedData.overallProgress ?? null,
            bookmarkedDate: validatedData.bookmarkedDate ?? null,
            lastAccessed: validatedData.lastAccessed ?? null,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update progress:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update progress" },
            { status: 500 }
        );
    }
}
