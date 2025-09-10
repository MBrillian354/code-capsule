"use client";

import React from "react";
import {
    Box,
    Card,
    CardContent,
    Skeleton,
    Stack,
} from "@mui/material";

export default function Loading() {
    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Card variant="outlined">
                <CardContent>
                    <Stack spacing={2}>
                        <Skeleton variant="text" sx={{ fontSize: "2rem", width: 200 }} />
                        <Skeleton variant="text" sx={{ width: "100%" }} />
                        <Skeleton variant="text" sx={{ width: "80%" }} />
                        <Skeleton variant="rectangular" sx={{ width: 120, height: 36, borderRadius: 1 }} />
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
