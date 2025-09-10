"use client";

import React from "react";
import { Box, Grid, Card, CardContent, Skeleton } from "@mui/material";

export default function Loading() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Dashboard Title Skeleton */}
            <Skeleton
                variant="text"
                sx={{
                    fontSize: "2.125rem",
                    fontWeight: "bold",
                    mb: 4,
                    width: "200px"
                }}
            />

            <Grid container spacing={3}>
                {/* Continue Learning Card Skeleton */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Skeleton
                            variant="text"
                            sx={{
                                mb: 2,
                                width: "180px",
                                fontSize: "1.5rem"
                            }}
                        />
                        <Card variant="outlined">
                            <CardContent
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minHeight: 140,
                                    gap: 2,
                                }}
                            >
                                <Skeleton variant="text" sx={{ fontSize: "1.25rem", width: "80%" }} />
                                <Skeleton variant="text" sx={{ width: "100%" }} />
                                <Skeleton variant="text" sx={{ width: "60%" }} />

                                <Box sx={{ mt: "auto" }}>
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                                        <Skeleton variant="text" sx={{ width: "100px" }} />
                                    </Box>
                                    <Skeleton variant="rectangular" sx={{ height: 8, borderRadius: 1 }} />
                                    <Box sx={{ mt: 2 }}>
                                        <Skeleton variant="rectangular" sx={{ height: 36, width: 140, borderRadius: 1 }} />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>

                {/* Recently Created Card Skeleton */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Skeleton
                            variant="text"
                            sx={{
                                mb: 2,
                                width: "160px",
                                fontSize: "1.5rem"
                            }}
                        />
                        <Card variant="outlined">
                            <CardContent
                                sx={{
                                    minHeight: 140,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                {/* First item */}
                                <Box>
                                    <Skeleton variant="text" sx={{ fontSize: "1.25rem", width: "70%" }} />
                                    <Skeleton variant="text" sx={{ width: "100%", mb: 1 }} />
                                    <Skeleton variant="rectangular" sx={{ height: 32, width: 120, borderRadius: 1, mb: 1 }} />
                                    <Skeleton variant="rectangular" sx={{ height: 1, width: "100%" }} />
                                </Box>

                                {/* Second item */}
                                <Box>
                                    <Skeleton variant="text" sx={{ fontSize: "1.25rem", width: "75%" }} />
                                    <Skeleton variant="text" sx={{ width: "90%", mb: 1 }} />
                                    <Skeleton variant="rectangular" sx={{ height: 32, width: 120, borderRadius: 1 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>

                {/* Create Capsule Form Skeleton */}
                <Grid size={12}>
                    <Card variant="outlined" sx={{ mt: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Skeleton
                                variant="text"
                                sx={{
                                    mb: 3,
                                    width: "200px",
                                    fontSize: "1.25rem"
                                }}
                            />

                            {/* Form fields skeleton */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Skeleton variant="rectangular" sx={{ height: 56, borderRadius: 1 }} />
                                <Skeleton variant="rectangular" sx={{ height: 120, borderRadius: 1 }} />
                                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                    <Skeleton variant="rectangular" sx={{ height: 36, width: 100, borderRadius: 1 }} />
                                    <Skeleton variant="rectangular" sx={{ height: 36, width: 120, borderRadius: 1 }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}