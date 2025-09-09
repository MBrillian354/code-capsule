import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    CardActions,
    Button,
    Alert,
} from "@mui/material";
import { verifySession, getUserCapsules } from "@/lib/dal";
import type { Capsule } from "@/lib/definitions";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import { Share } from "@mui/icons-material";

export default async function Page() {
    try {
        // Verify session and get user ID
        const session = await verifySession();
        
        // Fetch user's capsules
        const capsulesResult = await getUserCapsules(session.userId);
        const capsules = capsulesResult as Capsule[];

        const formatDate = (dateString: string) => {
            try {
                const date = new Date(dateString);
                const now = new Date();
                const diffInMs = now.getTime() - date.getTime();
                const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                
                if (diffInDays === 0) return "Today";
                if (diffInDays === 1) return "Yesterday";
                if (diffInDays < 7) return `${diffInDays} days ago`;
                if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
                if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
                return `${Math.floor(diffInDays / 365)} years ago`;
            } catch (error) {
                return "Unknown date";
            }
        };

        const getDescription = (content: any) => {
            try {
                return content?.meta?.description || "No description available";
            } catch (error) {
                return "No description available";
            }
        };

        const getSourceUrl = (content: any) => {
            try {
                return content?.meta?.source_url;
            } catch (error) {
                return null;
            }
        };

        const getHostname = (url: string) => {
            try {
                return new URL(url).hostname;
            } catch (error) {
                return url;
            }
        };

        return (
            <Box sx={{ flexGrow: 1 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: "bold", mb: 4 }}
                >
                    My Capsules
                </Typography>
                
                {capsules.length === 0 ? (
                    <Card variant="outlined" sx={{ textAlign: "center", py: 6 }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No capsules yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Create your first capsule by entering a URL on the dashboard.
                            </Typography>
                            <Button 
                                variant="contained" 
                                component={Link} 
                                href="/dashboard"
                            >
                                Go to Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {capsules.length} capsule{capsules.length === 1 ? '' : 's'} found
                        </Typography>
                        <Grid container spacing={3}>
                            {capsules.map((capsule: Capsule) => (
                                <Grid size={{ xs: 12, sm: 6, md: 12 }} key={capsule.id}>
                                    <Card 
                                        variant="outlined" 
                                        sx={{ 
                                            height: "100%", 
                                            display: "flex", 
                                            flexDirection: "column",
                                            transition: "all 0.2s ease-in-out"
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        mb: 1,
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {capsule.title || "Untitled Capsule"}
                                                </Typography>
                                                
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary" 
                                                    sx={{ 
                                                        mb: 2,
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {getDescription(capsule.content)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                                                {capsule.total_pages && (
                                                    <Chip 
                                                        label={`${capsule.total_pages} pages`} 
                                                        size="small" 
                                                        variant="outlined"
                                                    />
                                                )}
                                                {capsule.created_at && (
                                                    <Chip 
                                                        label={formatDate(capsule.created_at)} 
                                                        size="small" 
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>

                                            {getSourceUrl(capsule.content) && (
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.secondary"
                                                    sx={{ 
                                                        display: "block",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    Source: {getHostname(getSourceUrl(capsule.content))}
                                                </Typography>
                                            )}
                                        </CardContent>
                                        
                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            <Button 
                                                variant="contained" 
                                                size="small" 
                                                component={Link}
                                                href={`/dashboard/capsule/${capsule.id}/learn`}
                                            >
                                                Continue Reading
                                            </Button>
                                            <IconButton>
                                                <Share />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
            </Box>
        );
    } catch (error) {
        console.error("Error loading capsules:", error);
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: "bold", mb: 4 }}
                >
                    My Capsules
                </Typography>
                <Alert severity="error">
                    There was an error loading your capsules. Please try again later.
                </Alert>
            </Box>
        );
    }
}
