"use client";

import React from "react";
import {
    Box,
    Paper,
    Stack,
    Skeleton,
} from "@mui/material";

export default function Loading() {
    return (
        <Box className="min-h-screen flex items-center justify-center px-2 bg-gray-50">
            <Paper
                elevation={0}
                variant="outlined"
                className="p-8 w-full max-w-md"
            >
                <Skeleton variant="text" sx={{ fontSize: "2.125rem", width: 150, mx: "auto", mb: 2 }} />
                <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: 140, mx: "auto", mb: 4 }} />

                <Stack className="gap-4">
                    <Skeleton variant="rectangular" sx={{ width: "100%", height: 56, borderRadius: 1 }} />
                    <Skeleton variant="rectangular" sx={{ width: "100%", height: 56, borderRadius: 1 }} />
                    <Skeleton variant="rectangular" sx={{ width: "100%", height: 56, borderRadius: 1 }} />
                    <Skeleton variant="rectangular" sx={{ width: "100%", height: 56, borderRadius: 1 }} />
                    <Skeleton variant="rectangular" sx={{ width: "100%", height: 48, borderRadius: 1 }} />

                    <Skeleton variant="text" sx={{ width: 180, mx: "auto", mt: 2 }} />
                </Stack>
            </Paper>
        </Box>
    );
}
