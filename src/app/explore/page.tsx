import React from "react";
import { getAllPublicCapsules } from "@/lib/dal";
import ExploreClient from "./ExploreClient";
import type { CapsuleCardData, CapsuleStatsData } from "@/components/shared/types";

export default async function PublicExplorePage() {
    // Fetch public capsules (no per-user data)
    const capsules = await getAllPublicCapsules(20, 0);

    // Transform data for components
    const capsuleData: CapsuleCardData[] = capsules.map(capsule => ({
        id: capsule.id,
        title: capsule.title,
        description: capsule.content && typeof capsule.content === 'object' && 'meta' in capsule.content 
            ? (capsule.content as any).meta?.description || "No description available"
            : "No description available",
        total_pages: capsule.total_pages || 0,
        created_at: capsule.created_at,
        creator_name: capsule.creator_name || "Anonymous",
    learn_url: `/learn/${capsule.id}`,
        content: capsule.content,
        bookmarked_date: (capsule as any).bookmarked_date || null,
        last_page_read: (capsule as any).last_page_read || null,
        overall_progress: (capsule as any).overall_progress || null,
    }));

    const statsData: CapsuleStatsData = {
        totalCapsules: capsules.length,
        totalContributors: new Set(capsules.map(c => (c as any).created_by)).size,
        totalPages: capsules.reduce((acc, c) => acc + (c.total_pages || 0), 0)
    };

    return (
        <ExploreClient 
            capsules={capsuleData} 
            statsData={statsData} 
            isAuthenticated={false}
        />
    );
}

// Revalidate public explore every 5 minutes
export const revalidate = 300;
