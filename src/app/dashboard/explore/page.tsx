import React from "react";
import { getAllPublicCapsulesWithUserProgress, getSession } from "@server/queries";
import DashboardExploreContent from "./DashboardExploreContent";
import type { CapsuleCardData, CapsuleStatsData } from "@/components/shared/types";
import type { StoredCapsuleContent } from "@/lib/definitions";

export default async function DashboardExplorePage() {
    // Always get session for authenticated dashboard pages
    const session = await getSession();
    
    // Fetch public capsules with user progress
    const capsules = await getAllPublicCapsulesWithUserProgress(session.userId || null, 20, 0);
    
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
            learn_url: `/dashboard/capsule/${capsule.id}/learn`,
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

    return <DashboardExploreContent capsules={capsuleData} statsData={statsData} />;
}
