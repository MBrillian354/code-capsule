"use client";

import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import CapsuleGrid from "@/components/shared/CapsuleGrid";
import CapsuleStats from "@/components/shared/CapsuleStats";
import type { CapsuleCardData, CapsuleStatsData } from "@/components/shared/types";
import { toggleBookmark } from "@/lib/client/bookmarks";

interface DashboardExploreContentProps {
    capsules: CapsuleCardData[];
    statsData: CapsuleStatsData;
}

export default function DashboardExploreContent({ 
    capsules: initialCapsules, 
    statsData 
}: DashboardExploreContentProps) {
    const [capsules, setCapsules] = useState(initialCapsules);

    const handleBookmarkToggle = async (capsuleId: string, isBookmarked: boolean) => {
        try {
            // Optimistic update
            setCapsules(prev => prev.map(capsule => 
                capsule.id === capsuleId 
                    ? { 
                        ...capsule, 
                        bookmarked_date: isBookmarked ? new Date().toISOString() : null 
                    }
                    : capsule
            ));

            // Call API
            await toggleBookmark(capsuleId, isBookmarked);
        } catch (error) {
            // Revert optimistic update on failure
            setCapsules(prev => prev.map(capsule => 
                capsule.id === capsuleId 
                    ? { 
                        ...capsule, 
                        bookmarked_date: !isBookmarked ? new Date().toISOString() : null 
                    }
                    : capsule
            ));
            console.error("Failed to toggle bookmark:", error);
        }
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
                        href="/dashboard"
                        variant="contained"
                        color="primary"
                    >
                        Create Capsule
                    </Button>
                </Box>
                
                <CapsuleGrid 
                    capsules={capsules}
                    showBookmark={true}
                    isAuthenticated={true}
                    learnPath="/dashboard/capsule"
                    onBookmarkToggle={handleBookmarkToggle}
                    emptyStateConfig={{
                        title: "No capsules available yet",
                        description: "Be the first to create and share a learning capsule!",
                        actionText: "Create First Capsule",
                        actionHref: "/dashboard"
                    }}
                />
            </Box>
        </Box>
    );
}
