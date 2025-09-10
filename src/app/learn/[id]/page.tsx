import { getCapsuleWithUserProgress } from "@/lib/dal";
import { notFound } from "next/navigation";
import PublicLearnClient from "./PublicLearnClient";
import type { StoredCapsuleContent } from "@/lib/definitions";

export default async function PublicLearnPage(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id } = await props.params;
    
    // Fetch capsule without authentication (public access)
    const capsule = await getCapsuleWithUserProgress(id, null);
    if (!capsule) {
        notFound();
    }
    
    // Transform database structure to match client component expectations
    const content = (capsule.content || {}) as StoredCapsuleContent;
    const pages = content.pages || [];
    
    // Ensure we have valid pages structure
    if (!Array.isArray(pages) || pages.length === 0) {
        notFound();
    }
    
    const capsuleForClient = {
        id: capsule.id,
        title: capsule.title || "Untitled Capsule",
        description: content?.meta?.description || "",
        content: pages.map((page: { page_title?: string; title?: string; body?: string; content?: string }, index: number) => ({
            page: index + 1,
            page_title: page.page_title || page.title || `Page ${index + 1}`,
            body: page.body || page.content || ""
        })),
        last_page_read: 1, // Always start from page 1 for public users
        overall_progress: 0, // No stored progress for public users
        last_accessed: null,
        creator_name: capsule.creator_name || "Anonymous",
        created_at: capsule.created_at
    };

    return <PublicLearnClient capsule={capsuleForClient} />;
}
