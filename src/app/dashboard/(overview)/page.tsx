import React, { Suspense } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Divider,
    Button,
} from "@mui/material";
import Link from "next/link";
import { getContinueLearningCapsule, getRecentlyCreatedCapsules, verifySession } from "@server/queries";
import type { StoredCapsuleContent } from "@/lib/definitions";
import CreateCapsuleForm from "../../ui/dashboard/create-capsule-form";

export default async function Page() {
    // Verify session and get user ID
    const session = await verifySession();
    
    // Fetch continue learning capsule
    const continueLearningCapsule = await getContinueLearningCapsule(session.userId);
    
    // Get recently created capsules (limit to 3)
    const recentlyCreatedCapsules = await getRecentlyCreatedCapsules(session.userId, 2);
    
    // Extract description from content for display
    const getDescription = (capsule: Record<string, unknown>): string => {
        if (capsule.content && typeof capsule.content === 'object' && 'meta' in capsule.content) {
            const content = capsule.content as StoredCapsuleContent;
            return content.meta?.description || "No description available";
        }
        return "No description available";
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 4 }}
            >
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography gutterBottom variant="h5">
                            Continue Learning
                        </Typography>
                        <Card variant="outlined">
                            <CardContent
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minHeight: 140,
                                    "!important": { paddingBottom: 0 },
                                }}
                            >
                                {continueLearningCapsule ? (
                                    <>
                                        <Typography variant="h6">
                                            {continueLearningCapsule.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 1 }}
                                        >
                                            {getDescription(continueLearningCapsule)}
                                        </Typography>

                                        {/* progress area pushed to the bottom */}
                                        <Box sx={{ mt: "auto" }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {Math.round(continueLearningCapsule.overall_progress || 0)}% completed
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={continueLearningCapsule.overall_progress || 0}
                                            />
                                            <Box sx={{ mt: 2 }}>
                                                <Link href={`/dashboard/capsule/${continueLearningCapsule.id}/learn`}>
                                                    <Button variant="contained" color="primary">
                                                        Continue Learning
                                                    </Button>
                                                </Link>
                                            </Box>
                                        </Box>
                                    </>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", alignSelf: "center" }}>
                                        No capsules in progress. Create your first capsule below!
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography gutterBottom variant="h5">
                            Recently Created
                        </Typography>
                        <Card variant="outlined">
                            <CardContent
                                sx={{
                                    minHeight: 140,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                {recentlyCreatedCapsules.length > 0 ? (
                                    recentlyCreatedCapsules.map((resource, index) => (
                                        <Box key={resource.id}>
                                            <Typography variant="h6">
                                                {resource.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 1 }}
                                            >
                                                {getDescription(resource)}
                                            </Typography>
                                            <Box sx={{ mb: 1 }}>
                                                <Link href={`/dashboard/capsule/${resource.id}/learn`}>
                                                    <Button variant="contained" color="primary" size="small">
                                                        Start Learning
                                                    </Button>
                                                </Link>
                                            </Box>
                                            {index < recentlyCreatedCapsules.length - 1 && (
                                                <Divider />
                                            )}
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", alignSelf: "center" }}>
                                        No capsules created yet. Create your first capsule below!
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid size={12}>
                    <Suspense>
                        <CreateCapsuleForm />
                    </Suspense>
                </Grid>
            </Grid>
        </Box>
    );
}
