"use client";

import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import CapsuleGrid from "@/components/shared/CapsuleGrid";
import type { CapsuleCardData } from "@/components/shared/types";
import { toggleBookmark } from "@/lib/client/bookmarks";

interface BookmarksClientProps {
    capsules: CapsuleCardData[];
}

export default function BookmarksClient({ 
    capsules: initialCapsules 
}: BookmarksClientProps) {
    const [capsules, setCapsules] = useState(initialCapsules);

    const handleBookmarkToggle = async (capsuleId: string, isBookmarked: boolean) => {
        try {
            // Optimistic update - remove from bookmarks if unbookmarked
            if (!isBookmarked) {
                setCapsules(prev => prev.filter(capsule => capsule.id !== capsuleId));
            } else {
                // Update bookmark date if bookmarked again
                setCapsules(prev => prev.map(capsule => 
                    capsule.id === capsuleId 
                        ? { 
                            ...capsule, 
                            bookmarked_date: new Date().toISOString() 
                        }
                        : capsule
                ));
            }

            // Call API
            await toggleBookmark(capsuleId, isBookmarked);
        } catch (error) {
            // Revert optimistic update on failure
            if (!isBookmarked) {
                // Re-add the capsule if removing failed
                const originalCapsule = initialCapsules.find(c => c.id === capsuleId);
                if (originalCapsule) {
                    setCapsules(prev => [originalCapsule, ...prev]);
                }
            } else {
                // Revert bookmark date if adding failed
                setCapsules(prev => prev.map(capsule => 
                    capsule.id === capsuleId 
                        ? { 
                            ...capsule, 
                            bookmarked_date: null 
                        }
                        : capsule
                ));
            }
            console.error("Failed to toggle bookmark:", error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 600, mb: 2 }}
                >
                    Your Bookmarks
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 800 }}
                >
                    Quick access to the capsules you've bookmarked for later learning.
                </Typography>
            </Box>

            {/* Capsules Grid */}
            <Box sx={{ mt: 4 }}>
                <CapsuleGrid 
                    capsules={capsules}
                    showBookmark={true}
                    isAuthenticated={true}
                    learnPath="/dashboard/capsule"
                    onBookmarkToggle={handleBookmarkToggle}
                    emptyStateConfig={{
                        title: "No bookmarks yet",
                        description: "Start exploring capsules and bookmark the ones you want to read later!",
                        actionText: "Explore Capsules",
                        actionHref: "/dashboard/explore"
                    }}
                />
            </Box>
        </Box>
    );
}
