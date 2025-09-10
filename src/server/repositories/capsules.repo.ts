import "server-only";
import { sql } from "@/server/db/client";

// Helper type matching postgres JSONValue constraint
type JSONValue =
    | null
    | boolean
    | number
    | string
    | JSONValue[]
    | { [key: string]: JSONValue };

export async function insertCapsule(params: {
    title: string;
    total_pages: number;
    content: unknown;
    created_by: string;
    created_at: string;
}): Promise<{ id: string }> {
    const id = crypto.randomUUID();
    await sql`INSERT INTO capsules (id, title, total_pages, content, created_by, created_at) VALUES (${id}, ${
        params.title
    }, ${params.total_pages}, ${sql.json(
        params.content as unknown as JSONValue
    )}, ${params.created_by}, ${params.created_at})`;
    return { id };
}

export async function getCapsule(capsuleId: string) {
    const rows =
        await sql`SELECT id, title, total_pages, content, created_by, created_at FROM capsules WHERE id = ${capsuleId}`;
    return rows[0] ?? null;
}

export async function listCapsulesByUser(userId: string) {
    return await sql`SELECT id, title, total_pages, created_at, content FROM capsules WHERE created_by = ${userId} ORDER BY created_at DESC`;
}

export async function listCapsulesWithCreator(limit = 20, offset = 0) {
    return await sql`SELECT c.id, c.title, c.total_pages, c.created_at, c.content, u.name as creator_name FROM capsules c LEFT JOIN users u ON c.created_by = u.id ORDER BY c.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
}

export async function getCapsuleWithCreator(capsuleId: string) {
    const rows =
        await sql`SELECT c.id, c.title, c.total_pages, c.created_at, c.content, c.created_by, u.name as creator_name FROM capsules c LEFT JOIN users u ON c.created_by = u.id WHERE c.id = ${capsuleId}`;
    return rows[0] ?? null;
}
