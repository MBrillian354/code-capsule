import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { getAllPublicCapsules, getSession } from "@/lib/dal";
import CapsuleGrid from "@/components/shared/CapsuleGrid";
import CapsuleStats from "@/components/shared/CapsuleStats";
import type { CapsuleCardData, CapsuleStatsData } from "@/components/shared/types";

export default async function DashboardExplorePage() {
    // Always get session for authenticated dashboard pages
    const session = await getSession();
    
    // Fetch public capsules
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
        learn_url: `/dashboard/capsule/${capsule.id}/learn`,
        content: capsule.content // Keep the original content for the card component
    }));

    const statsData: CapsuleStatsData = {
        totalCapsules: capsules.length,
        totalContributors: new Set(capsules.map(c => c.created_by)).size,
        totalPages: capsules.reduce((acc, c) => acc + (c.total_pages || 0), 0)
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Dashboard Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 600, mb: 2 }}
                >
                    Explore Learning Capsules
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 800 }}
                >
                    Discover and learn from capsules created by the community. Bookmark your favorites and track your progress as you explore new topics.
                </Typography>
            </Box>

            {/* Stats */}
            <CapsuleStats data={statsData} />

            {/* Capsules Grid */}
            <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 600 }}
                    >
                        Latest Capsules
                    </Typography>
                    <Button
                        component={Link}
                        href="/dashboard/capsule/create"
                        variant="contained"
                        color="primary"
                    >
                        Create Capsule
                    </Button>
                </Box>
                
                <CapsuleGrid 
                    capsules={capsuleData}
                    showBookmark={true}
                    isAuthenticated={true}
                    learnPath="/dashboard/capsule"
                    emptyStateConfig={{
                        title: "No capsules available yet",
                        description: "Be the first to create and share a learning capsule!",
                        actionText: "Create First Capsule",
                        actionHref: "/dashboard/capsule/create"
                    }}
                />
            </Box>
        </Box>
    );
}
