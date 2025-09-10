"use client";

import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Skeleton,
    Container,
    Stack,
    AppBar,
    Toolbar,
} from "@mui/material";

export default function Loading() {
    return (
        <Box>
            {/* Top bar skeleton */}
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" sx={{ width: 120, fontSize: "1.25rem" }} />
                    </Stack>
                    <Skeleton variant="rectangular" sx={{ width: 80, height: 36, borderRadius: 1 }} />
                </Toolbar>
            </AppBar>

            {/* Hero skeleton */}
            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    background:
                        "radial-gradient(1000px 400px at 20% -10%, rgba(0,112,243,0.12), transparent 60%), radial-gradient(800px 300px at 80% -10%, rgba(99,102,241,0.12), transparent 60%)",
                    borderBottom: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                }}
            >
                <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Skeleton variant="rectangular" sx={{ width: 150, height: 24, borderRadius: 12, mb: 2 }} />
                            <Skeleton variant="text" sx={{ fontSize: "2.125rem", width: "100%", mb: 2 }} />
                            <Skeleton variant="text" sx={{ width: "100%", mb: 1 }} />
                            <Skeleton variant="text" sx={{ width: "80%", mb: 3 }} />
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Skeleton variant="rectangular" sx={{ width: 120, height: 48, borderRadius: 1 }} />
                                <Skeleton variant="rectangular" sx={{ width: 140, height: 48, borderRadius: 1 }} />
                            </Stack>
                            <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
                                <Stack>
                                    <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: 40 }} />
                                    <Skeleton variant="text" sx={{ width: 100 }} />
                                </Stack>
                                <Stack>
                                    <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: 30 }} />
                                    <Skeleton variant="text" sx={{ width: 120 }} />
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Skeleton variant="rectangular" sx={{ width: "100%", height: 300, borderRadius: 2 }} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features skeleton */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                <Grid container spacing={3}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <Skeleton variant="circular" width={24} height={24} />
                                        <Skeleton variant="text" sx={{ width: 100, fontSize: "1.25rem" }} />
                                    </Stack>
                                    <Skeleton variant="text" sx={{ width: "100%" }} />
                                    <Skeleton variant="text" sx={{ width: "90%" }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Callout skeleton */}
            <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
                <Box
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 2,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Stack spacing={1}>
                        <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: 250 }} />
                        <Skeleton variant="text" sx={{ width: 300 }} />
                    </Stack>
                    <Skeleton variant="rectangular" sx={{ width: 160, height: 48, borderRadius: 1 }} />
                </Box>
            </Container>

            {/* Footer skeleton */}
            <Box
                component="footer"
                sx={{
                    py: 4,
                    borderTop: (t) => `1px solid ${t.palette.divider}`,
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton variant="text" sx={{ width: 150 }} />
                    </Stack>
                    <Skeleton variant="text" sx={{ width: 100 }} />
                </Container>
            </Box>
        </Box>
    );
}
