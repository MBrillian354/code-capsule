"use client";

import React from "react";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Link from "next/link";
import CapsuleCard from "./CapsuleCard";
import type { CapsuleCardData } from "./types";

interface CapsuleGridProps {
    capsules: CapsuleCardData[];
    showBookmark?: boolean;
    isAuthenticated?: boolean;
    learnPath?: string;
    emptyStateConfig?: {
        title: string;
        description: string;
        actionText: string;
        actionHref: string;
    };
    onBookmarkToggle?: (capsuleId: string, isBookmarked: boolean) => void;
}

export default function CapsuleGrid({
    capsules,
    showBookmark = false,
    isAuthenticated = false,
    learnPath = "/learn",
    emptyStateConfig,
    onBookmarkToggle,
}: CapsuleGridProps) {
    if (capsules.length === 0) {
        const defaultEmptyState = {
            title: "No capsules available yet",
            description: "Be the first to create and share a learning capsule!",
            actionText: isAuthenticated
                ? "Create First Capsule"
                : "Join to Create",
            actionHref: isAuthenticated ? "/dashboard" : "/signup",
        };

        const emptyState = emptyStateConfig || defaultEmptyState;

        return (
            <Card variant="outlined">
                <CardContent sx={{ textAlign: "center", py: 6 }}>
                    <MenuBookIcon
                        sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                    >
                        {emptyState.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        {emptyState.description}
                    </Typography>
                    <Button
                        component={Link}
                        href={emptyState.actionHref}
                        variant="contained"
                        color="primary"
                    >
                        {emptyState.actionText}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Grid container spacing={3}>
            {capsules.map((capsule) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={capsule.id}>
                    <CapsuleCard
                        capsule={capsule}
                        showBookmark={showBookmark}
                        isAuthenticated={isAuthenticated}
                        learnPath={learnPath}
                        onBookmarkToggle={onBookmarkToggle}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
