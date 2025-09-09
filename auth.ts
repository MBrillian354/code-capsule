"use server";

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { User } from "@/lib/definitions";
import bcrypt from "bcryptjs";

async function getUser(email: string): Promise<User | undefined> {
    try {
        const baseUrl =
            process.env.NEXTAUTH_URL ||
            process.env.NEXT_PUBLIC_APP_URL ||
            "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/users/by-email`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-internal-token": process.env.NEXTAUTH_SECRET || "",
            },
            body: JSON.stringify({ email }),
            cache: "no-store",
        });

        if (res.status === 404) return undefined;
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const user: User = await res.json();
        return user;
    } catch (error) {
        console.error("Failed to fetch user via API:", error);
        throw new Error("Failed to fetch user.");
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (passwordsMatch) return user;
                }

                return null;
            },
        }),
    ],
});
