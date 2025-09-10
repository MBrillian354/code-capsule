import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { redirect } from "next/navigation";
import postgres from "postgres";
import type { User, Capsule, UserCapsule } from "@/lib/definitions";
import { z } from "zod";

/**
 * Data Access Layer (DAL)
 *
 * This module provides minimal, server-side data access helpers used across the
 * application. It uses the `postgres` client configured via
 * `process.env.POSTGRES_URL` and exposes cached helpers for session
 * verification, user retrieval, and user creation.
 *
 * Notes:
 * - All functions here are designed to run on the server (Next.js server
 *   components / API routes). The file starts with `server-only` to enforce that.
 * - `cache` from React is used to memoize results during a single server
 *   instance lifecycle for performance. Be mindful of cache invalidation when
 *   making changes that should be immediately visible.
 */

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export const verifySession = cache(async () => {
    /**
     * Verify the current request's session cookie and redirect if not
     * authenticated.
     *
     * Behavior:
     * - Reads the `session` cookie using Next's cookies helper.
     * - Attempts to decrypt the cookie payload via `decrypt`.
     * - If no valid session or userId exists, redirects the user to `/login`.
     *
     * Returns:
     * - { isAuth: true, userId: string } when authenticated.
     *
     * Side effects:
     * - Will trigger a client redirect using Next's `redirect` when the
     *   session is missing or invalid. Calling code should expect this side
     *   effect (i.e. this function does not return a falsy value on failure).
     */
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
        redirect("/login");
    }

    return { isAuth: true, userId: session.userId as string };
});

export const getSession = async () => {
    /**
     * Read the current request session cookie and return an auth shape.
     *
     * Returns:
     * - { isAuth: false, userId: null } when there is no valid session.
     * - { isAuth: true, userId: string } when a valid session exists.
     *
     * Note: unlike `verifySession`, this function does not redirect on missing
     * session; it returns the auth state instead and lets the caller decide how
     * to handle unauthenticated requests.
     */
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
        return { isAuth: false, userId: null };
    }

    return { isAuth: true, userId: session.userId as string };
};

export const getUser = cache(async () => {
    /**
     * Fetch the currently authenticated user's public profile data.
     *
     * Contract:
     * - Inputs: none (reads session from cookies)
     * - Outputs: User | null
     * - Errors: Returns null when user can't be fetched or session is missing.
     *
     * Edge cases:
     * - If `verifySession` triggers a redirect, this function will not reach
     *   the database call in that execution path.
     */
    const session = await verifySession();
    if (!session) return null;

    try {
        const users = await sql<User[]>`
      SELECT id, name, email FROM users WHERE id = ${session.userId}
    `;
        const user = users[0];
        return user;
    } catch (error) {
        console.log("Failed to fetch user");
        return null;
    }
});

export const getUserByEmail = cache(async (email: string) => {
    /**
     * Retrieve a user record by email.
     *
     * Parameters:
     * - email: string - the email address to look up.
     *
     * Returns:
     * - User | null - the first matching user or null on error / not found.
     *
     * Note: this function is cached; if you need the absolute latest row from
     * the DB for the same email within the same server lifecycle, avoid the
     * cached helper and query directly.
     */
    try {
        const users = await sql<User[]>`
      SELECT * FROM users WHERE email = ${email}
    `;
        return users[0];
    } catch (error) {
        console.log("Failed to fetch user by email");
        return null;
    }
});

export const createUser = async (
    name: string,
    email: string,
    hashedPassword: string
) => {
    /**
     * Create a new user record.
     *
     * Parameters:
     * - name: string - user's display name
     * - email: string - user's email (should be unique)
     * - hashedPassword: string - password hash (passwords must be hashed by caller)
     *
     * Returns:
     * - string: newly created user's ID on success
     *
     * Throws:
     * - Error when insertion fails. Callers should catch and handle this.
     */
    try {
        const userId = crypto.randomUUID();
        await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword})
    `;
        return userId;
    } catch (error) {
        console.log("Failed to create user");
        throw new Error("Failed to create user");
    }
};

// Capsule persistence
const CapsuleDbSchema = z.object({
    title: z.string(),
    total_pages: z.number().int().nonnegative(),
    content: z.any(),
    created_by: z.uuid(),
    created_at: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
});

export async function insertCapsule(params: {
    title: string;
    total_pages: number;
    content: unknown;
    created_by: string;
    created_at: string;
}): Promise<{ id: string }> {
    const parsed = CapsuleDbSchema.parse(params);
    const id = crypto.randomUUID();
    await sql`
    INSERT INTO capsules (id, title, total_pages, content, created_by)
    VALUES (${id}, ${parsed.title}, ${parsed.total_pages}, ${sql.json(
        parsed.content
    )}, ${parsed.created_by})
  `;
    return { id };
}

export const getUserCapsules = cache(async (userId: string) => {
    /**
     * Fetch all capsules created by a specific user, sorted by creation date (newest first).
     *
     * Parameters:
     * - userId: string - the ID of the user whose capsules to fetch
     *
     * Returns:
     * - Array of capsule objects with id, title, total_pages, created_at, and content metadata
     * - Empty array if no capsules found or on error
     */
    console.log("Fetching capsules for userId:", userId);
    try {
        const capsules = await sql`
            SELECT id, title, total_pages, created_at, content
            FROM capsules 
            WHERE created_by = ${userId}
            ORDER BY created_at DESC
        `;

        console.log(`Fetched ${capsules.length} capsules for userId:`, userId);
        return capsules;
    } catch (error) {
        console.log("Failed to fetch user capsules", error);
        return [];
    }
});

export const getUserCapsulesWithProgress = cache(async (userId: string) => {
    /**
     * Fetch all capsules created by a specific user with their progress information,
     * sorted by last accessed date (newest first), then by creation date.
     *
     * Parameters:
     * - userId: string - the ID of the user whose capsules to fetch
     *
     * Returns:
     * - Array of capsule objects with progress information
     * - Empty array if no capsules found or on error
     */
    console.log("Fetching capsules with progress for userId:", userId);
    try {
        const capsules = await sql`
            SELECT 
                c.id, 
                c.title, 
                c.total_pages, 
                c.created_at, 
                c.content,
                uc.last_page_read,
                uc.overall_progress,
                uc.bookmarked_date,
                uc.last_accessed
            FROM capsules c
            LEFT JOIN user_capsules uc ON c.id = uc.capsule_id AND uc.user_id = ${userId}
            WHERE c.created_by = ${userId}
            ORDER BY uc.last_accessed DESC NULLS LAST, c.created_at DESC
        `;

        console.log(`Fetched ${capsules.length} capsules with progress for userId:`, userId);
        return capsules;
    } catch (error) {
        console.log("Failed to fetch user capsules with progress", error);
        return [];
    }
});

export const getContinueLearningCapsule = cache(async (userId: string) => {
    /**
     * Fetch the capsule with the highest progress for "Continue Learning".
     * Filters capsules with overall_progress > 0, sorted by last_accessed DESC NULLS LAST, then created_at DESC.
     *
     * Parameters:
     * - userId: string - the ID of the user
     *
     * Returns:
     * - Capsule object with progress or null if none found
     */
    try {
        const capsules = await sql`
            SELECT 
                c.id, 
                c.title, 
                c.total_pages, 
                c.created_at, 
                c.content,
                uc.last_page_read,
                uc.overall_progress,
                uc.bookmarked_date,
                uc.last_accessed
            FROM capsules c
            LEFT JOIN user_capsules uc ON c.id = uc.capsule_id AND uc.user_id = ${userId}
            WHERE c.created_by = ${userId} AND uc.overall_progress > 0 AND uc.overall_progress IS NOT NULL
            ORDER BY uc.last_accessed DESC NULLS LAST, c.created_at DESC
            LIMIT 1
        `;
        return capsules[0] || null;
    } catch (error) {
        console.log("Failed to fetch continue learning capsule", error);
        return null;
    }
});

export const getRecentlyCreatedCapsules = cache(async (userId: string, limit: number = 3) => {
    /**
     * Fetch recently created capsules for a user, sorted by creation date DESC.
     *
     * Parameters:
     * - userId: string - the ID of the user
     * - limit: number - maximum number of capsules to return (default 3)
     *
     * Returns:
     * - Array of capsule objects with progress information
     */
    try {
        const capsules = await sql`
            SELECT 
                c.id, 
                c.title, 
                c.total_pages, 
                c.created_at, 
                c.content,
                uc.last_page_read,
                uc.overall_progress,
                uc.bookmarked_date,
                uc.last_accessed
            FROM capsules c
            LEFT JOIN user_capsules uc ON c.id = uc.capsule_id AND uc.user_id = ${userId}
            WHERE c.created_by = ${userId}
            ORDER BY c.created_at DESC
            LIMIT ${limit}
        `;
        return capsules;
    } catch (error) {
        console.log("Failed to fetch recently created capsules", error);
        return [];
    }
});

export const getCapsule = cache(async (capsuleId: string) => {
    /**
     * Fetch a specific capsule by ID.
     *
     * Parameters:
     * - capsuleId: string - the ID of the capsule to fetch
     *
     * Returns:
     * - Capsule object or null if not found or on error
     */
    try {
        const capsules = await sql`
            SELECT id, title, total_pages, content, created_by, created_at
            FROM capsules 
            WHERE id = ${capsuleId}
        `;
        return capsules[0] || null;
    } catch (error) {
        console.log("Failed to fetch capsule", error);
        return null;
    }
});

export const getUserCapsule = cache(async (userId: string, capsuleId: string) => {
    /**
     * Fetch user's progress for a specific capsule.
     *
     * Parameters:
     * - userId: string - the ID of the user
     * - capsuleId: string - the ID of the capsule
     *
     * Returns:
     * - UserCapsule object or null if not found or on error
     */
    try {
        const userCapsules = await sql`
            SELECT id, user_id, capsule_id, last_page_read, overall_progress, bookmarked_date, last_accessed
            FROM user_capsules 
            WHERE user_id = ${userId} AND capsule_id = ${capsuleId}
        `;
        return userCapsules[0] || null;
    } catch (error) {
        console.log("Failed to fetch user capsule", error);
        return null;
    }
});

export const upsertUserCapsule = async (params: {
    userId: string;
    capsuleId: string;
    lastPageRead?: number | null;
    overallProgress?: number | null;
    bookmarkedDate?: string | null;
    lastAccessed?: string | null;
}) => {
    /**
     * Insert or update user's progress for a capsule.
     *
     * Parameters:
     * - userId: string - the ID of the user
     * - capsuleId: string - the ID of the capsule
     * - lastPageRead: number | null - the last page the user read
     * - overallProgress: number | null - the overall progress percentage
     * - bookmarkedDate: string | null - ISO timestamp when bookmarked
     * - lastAccessed: string | null - ISO timestamp when last accessed
     *
     * Returns:
     * - The user capsule ID (existing or newly created)
     */
    try {
        const { userId, capsuleId, lastPageRead, overallProgress, bookmarkedDate, lastAccessed } = params;

        // Detect which optional fields were explicitly provided by the caller.
        const providedLastPage = Object.prototype.hasOwnProperty.call(params, "lastPageRead");
        const providedProgress = Object.prototype.hasOwnProperty.call(params, "overallProgress");
        const providedBookmarked = Object.prototype.hasOwnProperty.call(params, "bookmarkedDate");
        const providedLastAccessed = Object.prototype.hasOwnProperty.call(params, "lastAccessed");

    // Normalize provided values to concrete types for the postgres template types.
    const lastPageVal: number | null = providedLastPage ? (lastPageRead ?? null) : null;
    const progressVal: number | null = providedProgress ? (overallProgress ?? null) : null;
    const bookmarkedVal: string | null = providedBookmarked ? (bookmarkedDate ?? null) : null;
    const lastAccessedVal: string | null = providedLastAccessed ? (lastAccessed ?? null) : null;

    // Check if a row already exists for this user+capsule.
        const existing = await sql`
            SELECT id FROM user_capsules WHERE user_id = ${userId} AND capsule_id = ${capsuleId}
        `;

        if (existing.length) {
            // Update only the columns that were provided (this avoids wiping other fields to NULL).
            const existingId = existing[0].id as string;

            if (providedLastPage) {
                await sql`
                    UPDATE user_capsules
                    SET last_page_read = ${lastPageVal}
                    WHERE user_id = ${userId} AND capsule_id = ${capsuleId}
                `;
            }

            if (providedProgress) {
                await sql`
                    UPDATE user_capsules
                    SET overall_progress = ${progressVal}
                    WHERE user_id = ${userId} AND capsule_id = ${capsuleId}
                `;
            }

            if (providedBookmarked) {
                await sql`
                    UPDATE user_capsules
                    SET bookmarked_date = ${bookmarkedVal}
                    WHERE user_id = ${userId} AND capsule_id = ${capsuleId}
                `;
            }

            if (providedLastAccessed) {
                await sql`
                    UPDATE user_capsules
                    SET last_accessed = ${lastAccessedVal}
                    WHERE user_id = ${userId} AND capsule_id = ${capsuleId}
                `;
            }

            return existingId;
        }

        // No existing row -> insert. For omitted optional fields store NULL.
        const id = crypto.randomUUID();
        const lastPage = lastPageVal;
        const progress = progressVal;
        const bookmarked = bookmarkedVal;
        const lastAccessedInsert = lastAccessedVal;

        await sql`
            INSERT INTO user_capsules (id, user_id, capsule_id, last_page_read, overall_progress, bookmarked_date, last_accessed)
            VALUES (${id}, ${userId}, ${capsuleId}, ${lastPage}, ${progress}, ${bookmarked}, ${lastAccessedInsert})
        `;

        return id;
    } catch (error) {
        console.log("Failed to upsert user capsule", error);
        throw new Error("Failed to save user capsule progress");
    }
};
