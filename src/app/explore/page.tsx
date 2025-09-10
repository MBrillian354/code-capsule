import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import Link from "next/link";
import { getAllPublicCapsules } from "@/lib/dal";
import CapsuleStats from "@/components/shared/CapsuleStats";
import CapsuleGrid from "@/components/shared/CapsuleGrid";
import type { CapsuleCardData, CapsuleStatsData } from "@/components/shared/types";

export default async function PublicExplorePage() {
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
        learn_url: `/learn/${capsule.id}`,
        content: capsule.content
    }));

    const statsData: CapsuleStatsData = {
        totalCapsules: capsules.length,
        totalContributors: new Set(capsules.map(c => c.created_by)).size,
        totalPages: capsules.reduce((acc, c) => acc + (c.total_pages || 0), 0)
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
                    capsules={capsuleData}
                    showBookmark={false}
                    isAuthenticated={false}
                    learnPath="/learn"
                />
            </Box>

            {/* Call to Action */}
            {capsules.length > 0 && (
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
