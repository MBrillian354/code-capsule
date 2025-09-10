import React, { Suspense } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Divider,
} from "@mui/material";
import { getContinueLearningCapsule, getRecentlyCreatedCapsules } from "@/lib/dal";
import { verifySession } from "@/lib/dal";
import type { StoredCapsuleContent } from "@/lib/definitions";
import CreateCapsuleForm from "./create-capsule-form";

export default async function Page() {
    // Verify session and get user ID
    const session = await verifySession();
    
    // Fetch continue learning capsule
    const continueLearningSample = await getContinueLearningCapsule(session.userId);
    
    // Get recently created capsules (limit to 3)
    const recentlyCreatedSamples = await getRecentlyCreatedCapsules(session.userId, 3);
    
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
                                {continueLearningSample ? (
                                    <>
                                        <Typography variant="h6">
                                            {continueLearningSample.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 1 }}
                                        >
                                            {getDescription(continueLearningSample)}
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
                                                    {Math.round(continueLearningSample.overall_progress || 0)}% completed
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={continueLearningSample.overall_progress || 0}
                                            />
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
                                {recentlyCreatedSamples.length > 0 ? (
                                    recentlyCreatedSamples.map((resource, index) => (
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
                                            {index < recentlyCreatedSamples.length - 1 && (
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
