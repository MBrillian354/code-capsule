// This file contains type definitions for the app's data.
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
};

// JSON stored in the `capsules.content` column. It's application-specific
// so keep it flexible; prefer a typed shape when the content schema is known.
export type CapsuleContent = Record<string, unknown> | unknown[] | null;

export type Capsule = {
    id: string;
    title?: string | null;
    total_pages?: number | null;
    // JSON column in the DB
    content?: CapsuleContent;
    // references users.id
    created_by?: string | null;
    created_at?: string | null; // ISO timestamp
};

export type UserCapsule = {
    id: string;
    // references users.id
    user_id: string;
    // references capsules.id
    capsule_id: string;
    last_page_read?: number | null;
    overall_progress?: number | null; // double precision in DB
    bookmarked_date?: string | null; // ISO timestamp
};
