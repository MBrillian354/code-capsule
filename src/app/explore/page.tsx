import React from "react";
import { getAllPublicCapsules } from "@/lib/dal";
import ExploreClient from "./ExploreClient";
import type { CapsuleCardData, CapsuleStatsData } from "@/components/shared/types";
import type { StoredCapsuleContent } from "@/lib/definitions";

export default async function PublicExplorePage() {
    // Fetch public capsules (no per-user data)
    const capsules = await getAllPublicCapsules(20, 0);

    // Transform data for components
    const capsuleData: CapsuleCardData[] = capsules.map((capsule) => {
        const content = capsule.content as StoredCapsuleContent | undefined;
        const description = content?.meta?.description ?? "No description available";
        return {
            id: capsule.id,
            title: capsule.title,
            description,
            total_pages: capsule.total_pages || 0,
            created_at: capsule.created_at,
            creator_name: capsule.creator_name || "Anonymous",
            learn_url: `/learn/${capsule.id}`,
            content: capsule.content,
            bookmarked_date: capsule.bookmarked_date ?? null,
            last_page_read: capsule.last_page_read ?? null,
            overall_progress: capsule.overall_progress ?? null,
        };
    });

    const statsData: CapsuleStatsData = {
        totalCapsules: capsules.length,
        totalContributors: new Set(capsules.map((c) => c.created_by)).size,
        totalPages: capsules.reduce((acc, c) => acc + (c.total_pages || 0), 0),
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
