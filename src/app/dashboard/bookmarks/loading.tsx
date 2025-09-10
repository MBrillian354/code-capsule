"use client";

import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Skeleton,
    Typography,
    Stack,
    Chip,
    Button,
} from "@mui/material";

export default function Loading() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header Skeleton */}
            <Box sx={{ mb: 4 }}>
                <Skeleton
                    variant="text"
                    sx={{
                        fontSize: "2.125rem",
                        fontWeight: 600,
                        mb: 2,
                        width: "250px"
                    }}
                />
                <Skeleton
                    variant="text"
                    sx={{
                        width: "500px",
                        fontSize: "1rem"
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
        </Box>
    );
}
