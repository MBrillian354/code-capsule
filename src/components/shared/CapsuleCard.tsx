"use client";

import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Stack,
    IconButton,
} from "@mui/material";
import {
    BookmarkBorder as BookmarkBorderIcon,
    Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import Link from "next/link";
import type { StoredCapsuleContent } from "@/lib/definitions";
import type { CapsuleCardData } from "./types";

interface CapsuleCardProps {
    capsule: CapsuleCardData;
    showBookmark?: boolean;
    isAuthenticated?: boolean;
    learnPath?: string; // "/learn" for public, "/dashboard/learn" for auth
    onBookmarkToggle?: (capsuleId: string, isBookmarked: boolean) => void;
}

export default function CapsuleCard({
    capsule,
    showBookmark = false,
    isAuthenticated = false,
    learnPath = "/learn",
    onBookmarkToggle,
}: CapsuleCardProps) {
    const isBookmarked = !!capsule.bookmarked_date;

    // Extract description from content
    const getDescription = (): string => {
        if (
            capsule.content &&
            typeof capsule.content === "object" &&
            "meta" in capsule.content
        ) {
            const content = capsule.content as StoredCapsuleContent;
            return content.meta?.description || "No description available";
        }
        return "No description available";
    };

    // Format date
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleBookmarkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onBookmarkToggle) {
            onBookmarkToggle(capsule.id, !isBookmarked);
        }
    };

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-2px)",
                },
            }}
        >
            <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, flexGrow: 1, pr: 1 }}
                    >
                        {capsule.title}
                    </Typography>
                    {showBookmark && isAuthenticated && (
                        <IconButton
                            size="small"
                            onClick={handleBookmarkClick}
                            color={isBookmarked ? "primary" : "default"}
                        >
                            {isBookmarked ? (
                                <BookmarkIcon />
                            ) : (
                                <BookmarkBorderIcon />
                            )}
                        </IconButton>
                    )}
                </Stack>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                >
                    {getDescription()}
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

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="caption" color="text.secondary">
                        by {capsule.creator_name || "Anonymous"}
                    </Typography>
                    <Button
                        component={Link}
                        href={
                            `${learnPath}/${capsule.id}` +
                            (isAuthenticated ? `/learn` : "")
                        }
                        variant="contained"
                        color="primary"
                        size="small"
                    >
                        Start Learning
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
