"use client";

import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Skeleton,
    Stack,
} from "@mui/material";

export default function Loading() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Hero Section Skeleton */}
            <Box
                sx={{
                    borderRadius: 2,
                    p: { xs: 3, md: 5 },
                    mb: 4,
                    textAlign: "center",
                    backgroundColor: "grey.50",
                }}
            >
                <Skeleton
                    variant="text"
                    sx={{
                        fontSize: "2.125rem",
                        fontWeight: 600,
                        mb: 2,
                        width: "400px",
                        mx: "auto"
                    }}
                />
                <Skeleton
                    variant="text"
                    sx={{
                        width: "600px",
                        mx: "auto",
                        mb: 1
                    }}
                />
                <Skeleton
                    variant="text"
                    sx={{
                        width: "500px",
                        mx: "auto",
                        mb: 3
                    }}
                />
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="center"
                >
                    <Skeleton variant="rectangular" sx={{ width: 180, height: 48, borderRadius: 1 }} />
                    <Skeleton variant="rectangular" sx={{ width: 120, height: 48, borderRadius: 1 }} />
                </Stack>
            </Box>

            {/* Stats Skeleton */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={index}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: "center", py: 3 }}>
                                <Skeleton
                                    variant="text"
                                    sx={{
                                        fontSize: "2rem",
                                        fontWeight: "bold",
                                        mb: 1,
                                        width: "60px",
                                        mx: "auto"
                                    }}
                                />
                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: "120px",
                                        mx: "auto"
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Capsules Section Header */}
            <Box sx={{ mb: 3 }}>
                <Skeleton
                    variant="text"
                    sx={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        width: "200px",
                        mb: 3
                    }}
                />
            </Box>

            {/* Capsules Grid Skeleton */}
            <Grid container spacing={3}>
                {/* Generate 6 skeleton cards */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
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
                                    <Skeleton
                                        variant="text"
                                        sx={{ fontSize: "1.25rem", width: "80%" }}
                                    />
                                    <Skeleton variant="circular" sx={{ width: 24, height: 24 }} />
                                </Stack>

                                <Skeleton
                                    variant="text"
                                    sx={{ width: "100%", mb: 1 }}
                                />
                                <Skeleton
                                    variant="text"
                                    sx={{ width: "60%", mb: 2 }}
                                />

                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    <Skeleton variant="rectangular" sx={{ height: 24, width: 80, borderRadius: 12 }} />
                                    <Skeleton variant="rectangular" sx={{ height: 24, width: 100, borderRadius: 12 }} />
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mt: "auto" }}
                                >
                                    <Skeleton variant="text" sx={{ width: "100px" }} />
                                    <Skeleton variant="rectangular" sx={{ height: 32, width: 120, borderRadius: 1 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Call to Action Skeleton */}
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
                <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: 300, mx: "auto", mb: 2 }} />
                <Skeleton variant="text" sx={{ width: 400, mx: "auto", mb: 3 }} />
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="center"
                >
                    <Skeleton variant="rectangular" sx={{ width: 140, height: 48, borderRadius: 1 }} />
                    <Skeleton variant="rectangular" sx={{ width: 100, height: 48, borderRadius: 1 }} />
                </Stack>
            </Box>
        </Box>
    );
}
