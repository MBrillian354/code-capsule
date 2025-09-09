import { getCapsule, getUserCapsule, verifySession } from "@/lib/dal";
import { notFound } from "next/navigation";
import ReaderClient from "./ReaderClient";
import type { StoredCapsuleContent } from "@/lib/definitions";

export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id } = await props.params;
    
    // Verify user session
    const session = await verifySession();
    
    // Fetch capsule from database
    const capsule = await getCapsule(id);
    if (!capsule) {
        notFound();
    }
    
    // Fetch user's progress for this capsule
    const userProgress = await getUserCapsule(session.userId, id);
    
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
        last_page_read: userProgress?.last_page_read || 1,
        overall_progress: userProgress?.overall_progress || 0,
        last_accessed: userProgress?.last_accessed || null
    };

    // Pass to client component. Query state managed client-side via useSearchParams.
    return <ReaderClient capsule={capsuleForClient} />;
}
