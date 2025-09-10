"use client";

import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Skeleton,
    Typography,
    Chip,
} from "@mui/material";

export default function Loading() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header Skeleton */}
            <Skeleton
                variant="text"
                sx={{
                    fontSize: "2.125rem",
                    fontWeight: "bold",
                    mb: 4,
                    width: "200px"
                }}
            />

            {/* Count Skeleton */}
            <Skeleton
                variant="text"
                sx={{
                    mb: 3,
                    width: "150px",
                    fontSize: "1rem"
                }}
            />

            {/* Capsules Grid Skeleton */}
            <Grid container spacing={3}>
                {/* Generate 3 skeleton cards (full width) */}
                {Array.from({ length: 3 }).map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 12 }} key={index}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Skeleton
                                        variant="text"
                                        sx={{
                                            fontSize: "1.25rem",
                                            fontWeight: 600,
                                            mb: 1,
                                            width: "70%"
                                        }}
                                    />
                                    <Skeleton
                                        variant="text"
                                        sx={{ width: "100%", mb: 1 }}
                                    />
                                    <Skeleton
                                        variant="text"
                                        sx={{ width: "80%" }}
                                    />
                                </Box>

                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                                    <Skeleton variant="rectangular" sx={{ height: 24, width: 80, borderRadius: 12 }} />
                                    <Skeleton variant="rectangular" sx={{ height: 24, width: 100, borderRadius: 12 }} />
                                    <Skeleton variant="rectangular" sx={{ height: 24, width: 120, borderRadius: 12 }} />
                                </Box>

                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: "200px",
                                        fontSize: "0.75rem"
                                    }}
                                />
                            </CardContent>

                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Skeleton variant="rectangular" sx={{ height: 32, width: 140, borderRadius: 1 }} />
                                <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
