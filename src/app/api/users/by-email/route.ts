import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserByEmail } from "@/lib/dal";

const BodySchema = z.object({
    email: z.string().email(),
});

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsed = BodySchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid body" },
                { status: 400 }
            );
        }

        const { email } = parsed.data;
        const user = await getUserByEmail(email);
        
        if (!user) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        
        // Return user data (password included for auth purposes)
        return NextResponse.json(user);
    } catch (err) {
        console.error("/api/users/by-email error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
