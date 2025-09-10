import React from "react";
import { getAllPublicCapsulesWithUserProgress, getSession } from "@/lib/dal";
import ExploreClient from "./ExploreClient";
import type { CapsuleCardData, CapsuleStatsData } from "@/components/shared/types";

export default async function PublicExplorePage() {
    // Check for session to support authenticated users
    const session = await getSession();
    const isAuthenticated = session.isAuth && !!session.userId;
    
    // Fetch public capsules with user progress if authenticated
    const capsules = await getAllPublicCapsulesWithUserProgress(
        isAuthenticated ? session.userId : null, 
        20, 
        0
    );

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
        learn_url: isAuthenticated ? `/dashboard/capsule/${capsule.id}/learn` : `/learn/${capsule.id}`,
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
            isAuthenticated={isAuthenticated}
        />
    );
}
