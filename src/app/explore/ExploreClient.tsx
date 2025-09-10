"use client";

import React, { useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import Link from "next/link";
import CapsuleStats from "@/components/shared/CapsuleStats";
import CapsuleGrid from "@/components/shared/CapsuleGrid";
import type { CapsuleCardData, CapsuleStatsData } from "@/components/shared/types";
import { toggleBookmark } from "@/lib/client/bookmarks";

interface ExploreClientProps {
    capsules: CapsuleCardData[];
    statsData: CapsuleStatsData;
    isAuthenticated: boolean;
}

export default function ExploreClient({ 
    capsules: initialCapsules, 
    statsData, 
    isAuthenticated 
}: ExploreClientProps) {
    const [capsules, setCapsules] = useState(initialCapsules);

    const handleBookmarkToggle = async (capsuleId: string, isBookmarked: boolean) => {
        if (!isAuthenticated) return;
        
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
            {/* Hero Section */}
            <Box
                sx={{
                    borderRadius: 2,
                    p: { xs: 3, md: 5 },
                    mb: 4,
                    textAlign: "center",
                    backgroundColor: "grey.50",
                }}
            >
                <Typography
                    variant="h3"
                    sx={{ fontWeight: 600, mb: 2 }}
                >
                    Explore Learning Capsules
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 3, maxWidth: 600, mx: "auto" }}
                >
                    Discover curated knowledge capsules created by the community. Learn from tutorials, articles, and documentation in bite-sized, focused sessions.
                </Typography>
                {!isAuthenticated && (
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            component={Link}
                            href="/signup"
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            Join to Create Capsules
                        </Button>
                        <Button
                            component={Link}
                            href="/login"
                            variant="outlined"
                            color="primary"
                            size="large"
                        >
                            Sign In
                        </Button>
                    </Stack>
                )}
                {isAuthenticated && (
                    <Button
                        component={Link}
                        href="/dashboard"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Go to Dashboard
                    </Button>
                )}
            </Box>

            {/* Stats */}
            <Box sx={{ mb: 4 }}>
                <CapsuleStats data={statsData} />
            </Box>

            {/* Capsules Grid */}
            <Box>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: "bold", mb: 3 }}
                >
                    Latest Capsules
                </Typography>
                
                <CapsuleGrid
                    capsules={capsules}
                    showBookmark={isAuthenticated}
                    isAuthenticated={isAuthenticated}
                    learnPath={isAuthenticated ? "/dashboard/capsule" : "/learn"}
                    onBookmarkToggle={isAuthenticated ? handleBookmarkToggle : undefined}
                />
            </Box>

            {/* Call to Action */}
            {capsules.length > 0 && !isAuthenticated && (
                <Box
                    sx={{
                        mt: 6,
                        p: { xs: 3, md: 4 },
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "grey.50",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        Ready to create your own capsules?
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Join CodeCapsule to create, save, and share your own learning materials.
                    </Typography>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            component={Link}
                            href="/signup"
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            Get Started Free
                        </Button>
                        <Button
                            component={Link}
                            href="/login"
                            variant="outlined"
                            color="primary"
                            size="large"
                        >
                            Sign In
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
}
