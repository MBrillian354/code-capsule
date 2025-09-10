import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Stack,
} from "@mui/material";
import {
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
    MenuBook as MenuBookIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { getAllPublicCapsules, getSession } from "@/lib/dal";
import type { StoredCapsuleContent } from "@/lib/definitions";

export default async function ExplorePage() {
    // Get session to check if user is authenticated
    const session = await getSession();
    
    // Fetch public capsules
    const capsules = await getAllPublicCapsules(20, 0);
    
    // Extract description from content for display
    const getDescription = (capsule: Record<string, unknown>): string => {
        if (capsule.content && typeof capsule.content === 'object' && 'meta' in capsule.content) {
            const content = capsule.content as StoredCapsuleContent;
            return content.meta?.description || "No description available";
        }
        return "No description available";
    };

    // Format date
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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
                {!session.isAuth && (
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
            </Box>

            {/* Stats */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: "center" }}>
                                <MenuBookIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {capsules.length}+
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Learning Capsules
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: "center" }}>
                                <PersonIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {new Set(capsules.map(c => c.created_by)).size}+
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Contributors
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: "center" }}>
                                <AccessTimeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {capsules.reduce((acc, c) => acc + (c.total_pages || 0), 0)}+
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Pages
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
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
                
                {capsules.length > 0 ? (
                    <Grid container spacing={3}>
                        {capsules.map((capsule) => (
                            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={capsule.id}>
                                <Card 
                                    variant="outlined" 
                                    sx={{ 
                                        height: "100%", 
                                        display: "flex", 
                                        flexDirection: "column",
                                        transition: "transform 0.2s ease-in-out",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                            {capsule.title}
                                        </Typography>
                                        
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 2, flexGrow: 1 }}
                                        >
                                            {getDescription(capsule)}
                                        </Typography>

                                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                            <Chip
                                                label={`${capsule.total_pages || 0} pages`}
                                                size="small"
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={formatDate(capsule.created_at)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Stack>

                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="caption" color="text.secondary">
                                                by {capsule.creator_name || "Anonymous"}
                                            </Typography>
                                            <Button
                                                component={Link}
                                                href={`/dashboard/capsule/${capsule.id}/learn`}
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                            >
                                                Start Learning
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Card variant="outlined">
                        <CardContent sx={{ textAlign: "center", py: 6 }}>
                            <MenuBookIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                No capsules available yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Be the first to create and share a learning capsule!
                            </Typography>
                            {session.isAuth ? (
                                <Button
                                    component={Link}
                                    href="/dashboard/capsule/create"
                                    variant="contained"
                                    color="primary"
                                >
                                    Create First Capsule
                                </Button>
                            ) : (
                                <Button
                                    component={Link}
                                    href="/signup"
                                    variant="contained"
                                    color="primary"
                                >
                                    Join to Create
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </Box>

            {/* Call to Action */}
            {!session.isAuth && capsules.length > 0 && (
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
