"use client";

import React from "react";
import {
    Box,
    Card,
    Alert,
    Stack,
    Skeleton,
} from "@mui/material";

export default function Loading() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 6 }}>
            {/* Authentication notice skeleton */}
            <Alert
                severity="info"
                sx={{
                    borderRadius: 2,
                    "& .MuiAlert-message": { width: "100%" },
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                >
                    <Skeleton variant="text" sx={{ width: "100%" }} />
                </Stack>
            </Alert>

            {/* Sticky progress/header bar skeleton */}
            <Card
                elevation={1}
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: (t) => t.zIndex.appBar - 1,
                    backgroundColor: "white",
                    borderBottom: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    px: { xs: 2, md: 3 },
                    py: 1.5,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Box>
                        <Skeleton variant="text" sx={{ width: 200, fontSize: "1rem", fontWeight: 600 }} />
                        <Skeleton variant="text" sx={{ width: 150, fontSize: "0.875rem" }} />
                        <Skeleton variant="text" sx={{ width: 100, fontSize: "0.75rem" }} />
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Skeleton variant="text" sx={{ width: 80, fontSize: "0.875rem" }} />
                        <Skeleton variant="text" sx={{ width: 100, fontSize: "0.875rem" }} />
                    </Box>
                </Box>
                <Skeleton variant="rectangular" sx={{ width: "100%", height: 4, borderRadius: 2 }} />
            </Card>

            {/* Content skeleton */}
            <Card
                elevation={0}
                variant="outlined"
                sx={{
                    pt: 2,
                    pb: 4,
                    px: { xs: 2, md: 5 },
                    backgroundColor: "white",
                }}
            >
                {/* Article content skeleton */}
                <Box sx={{ mb: 3 }}>
                    <Skeleton variant="text" sx={{ width: "100%", fontSize: "1.25rem", mb: 2 }} />
                    <Skeleton variant="text" sx={{ width: "100%", mb: 1 }} />
                    <Skeleton variant="text" sx={{ width: "95%", mb: 1 }} />
                    <Skeleton variant="text" sx={{ width: "100%", mb: 1 }} />
                    <Skeleton variant="text" sx={{ width: "90%", mb: 2 }} />
                    <Skeleton variant="text" sx={{ width: "100%", mb: 1 }} />
                    <Skeleton variant="text" sx={{ width: "100%", mb: 1 }} />
                    <Skeleton variant="text" sx={{ width: "85%", mb: 2 }} />
                    <Skeleton variant="text" sx={{ width: "100%", mb: 1 }} />
                    <Skeleton variant="text" sx={{ width: "95%", mb: 1 }} />
                    <Skeleton variant="text" sx={{ width: "100%", mb: 1 }} />
                    <Skeleton variant="text" sx={{ width: "90%" }} />
                </Box>

                {/* Pager skeleton */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 3,
                    }}
                >
                    <Skeleton variant="rectangular" sx={{ width: 100, height: 36, borderRadius: 1 }} />

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Skeleton variant="rectangular" sx={{ width: 120, height: 32, borderRadius: 1 }} />
                        <Skeleton variant="rectangular" sx={{ width: 80, height: 36, borderRadius: 1 }} />
                    </Stack>
                </Box>
            </Card>
        </Box>
    );
}
