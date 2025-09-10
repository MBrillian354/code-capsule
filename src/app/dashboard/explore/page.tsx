import React from "react";
import { getAllPublicCapsulesWithUserProgress, getSession } from "@/lib/dal";
import DashboardExploreContent from "./DashboardExploreContent";
import type { CapsuleCardData, CapsuleStatsData } from "@/components/shared/types";

export default async function DashboardExplorePage() {
    // Always get session for authenticated dashboard pages
    const session = await getSession();
    
    // Fetch public capsules with user progress
    const capsules = await getAllPublicCapsulesWithUserProgress(session.userId || null, 20, 0);
    
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
        learn_url: `/dashboard/capsule/${capsule.id}/learn`,
        content: capsule.content, // Keep the original content for the card component
        bookmarked_date: (capsule as any).bookmarked_date || null,
        last_page_read: (capsule as any).last_page_read || null,
        overall_progress: (capsule as any).overall_progress || null,
    }));

    const statsData: CapsuleStatsData = {
        totalCapsules: capsules.length,
        totalContributors: new Set(capsules.map(c => (c as any).created_by)).size,
        totalPages: capsules.reduce((acc, c) => acc + (c.total_pages || 0), 0)
    };

    return <DashboardExploreContent capsules={capsuleData} statsData={statsData} />;
}
