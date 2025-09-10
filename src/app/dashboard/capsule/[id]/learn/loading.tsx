"use client";

import React from "react";
import {
    Box,
    Card,
    LinearProgress,
    Typography,
    Stack,
    Alert,
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
                    <Typography variant="body2">
                        Loading capsule content...
                    </Typography>
                </Stack>
            </Alert>

            {/* Sticky progress/header bar skeleton */}
            <Card
                elevation={1}
                sx={{
                    position: "sticky",
                    top: 64,
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
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                        >
                            <Box component="span" sx={{ display: "inline-block", width: "200px" }}>
                                Loading capsule...
                            </Box>
                        </Typography>
                        <Typography variant="subtitle2">
                            <Box component="span" sx={{ display: "inline-block", width: "150px" }}>
                                Loading page...
                            </Box>
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            <Box component="span" sx={{ display: "inline-block", width: "100px" }}>
                                by Anonymous
                            </Box>
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <Box sx={{ textAlign: "right" }}>
                            <Typography variant="body2" color="text.secondary">
                                Chapter 1/1
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                0% complete
                            </Typography>
                        </Box>
                        <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: "grey.300" }} />
                    </Box>
                </Box>
                <LinearProgress variant="determinate" value={0} />
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
                {/* Content paragraphs skeleton */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ height: 24, bgcolor: "grey.300", borderRadius: 1, mb: 2, width: "90%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 1, width: "100%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 1, width: "95%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 1, width: "85%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 3, width: "100%" }} />

                    <Box sx={{ height: 24, bgcolor: "grey.300", borderRadius: 1, mb: 2, width: "80%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 1, width: "100%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 1, width: "90%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 1, width: "95%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 3, width: "100%" }} />

                    <Box sx={{ height: 24, bgcolor: "grey.300", borderRadius: 1, mb: 2, width: "85%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 1, width: "100%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 1, width: "92%" }} />
                    <Box sx={{ height: 16, bgcolor: "grey.300", borderRadius: 1, mb: 1, width: "88%" }} />
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
                    <Box sx={{ width: 100, height: 36, bgcolor: "grey.300", borderRadius: 1 }} />
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 120, height: 32, bgcolor: "grey.300", borderRadius: 1 }} />
                        <Box sx={{ width: 80, height: 36, bgcolor: "grey.300", borderRadius: 1 }} />
                    </Stack>
                </Box>
            </Card>
        </Box>
    );
}
