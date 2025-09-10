import { getCapsuleWithUserProgress, getSession } from "@server/queries";
import { notFound } from "next/navigation";
import ReaderClient from "./ReaderClient";
import type { StoredCapsuleContent } from "@/lib/definitions";

export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id } = await props.params;
    
    // Get session without requiring authentication (public access)
    const session = await getSession();
    const userId = session.isAuth ? session.userId : null;
    
    // Fetch capsule with user progress if authenticated
    const capsule = await getCapsuleWithUserProgress(id, userId);
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
        last_page_read: capsule.last_page_read || 1,
        overall_progress: capsule.overall_progress || 0,
        last_accessed: capsule.last_accessed || null,
        // Additional metadata for display
        creator_name: capsule.creator_name || "Anonymous",
        created_at: capsule.created_at
    };

    // Pass to client component. Query state managed client-side via useSearchParams.
    return <ReaderClient capsule={capsuleForClient} isAuthenticated={session.isAuth} />;
}
