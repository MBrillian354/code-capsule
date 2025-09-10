import { NextRequest, NextResponse } from "next/server";
import { upsertUserCapsule, getSession } from "@server/queries";
import { z } from "zod";

const BookmarkToggleSchema = z.object({
    capsuleId: z.string().uuid(),
    isBookmarked: z.boolean(),
});

export async function POST(request: NextRequest) {
    try {
        // Verify session
        const session = await getSession();
        if (!session.isAuth || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const validatedData = BookmarkToggleSchema.parse(body);

        // Update bookmark status
        await upsertUserCapsule({
            userId: session.userId,
            capsuleId: validatedData.capsuleId,
            bookmarkedDate: validatedData.isBookmarked ? new Date().toISOString() : null,
        });

        return NextResponse.json({ 
            success: true, 
            bookmarked: validatedData.isBookmarked 
        });
    } catch (error) {
        console.error("Failed to toggle bookmark:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to toggle bookmark" },
            { status: 500 }
        );
    }
}
