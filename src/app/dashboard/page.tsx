"use client";

import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    LinearProgress,
    Divider,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import {
    continueLearningSample,
    recentlySavedSamples,
} from "./placeholder-data";

export default function Page() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 4 }}
            >
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography gutterBottom variant="h5">
                            Continue Learning
                        </Typography>
                        <Card variant="outlined">
                            <CardContent
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minHeight: 140,
                                    "!important": { paddingBottom: 0 },
                                }}
                            >
                                <Typography variant="h6">
                                    {continueLearningSample.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    {continueLearningSample.description}
                                </Typography>

                                {/* progress area pushed to the bottom */}
                                <Box sx={{ mt: "auto" }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {
                                                continueLearningSample.overall_progress
                                            }
                                            % completed
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={
                                            continueLearningSample.overall_progress
                                        }
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography gutterBottom variant="h5">
                            Recently Saved
                        </Typography>
                        <Card variant="outlined">
                            <CardContent
                                sx={{
                                    minHeight: 140,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                {recentlySavedSamples.map((resource, index) => (
                                    <Box key={resource.id}>
                                        <Typography variant="h6">
                                            {resource.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 1 }}
                                        >
                                            {resource.description}
                                        </Typography>
                                        {index <
                                            recentlySavedSamples.length - 1 && (
                                            <Divider />
                                        )}
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        sx={{ backgroundColor: "white" }}
                        placeholder="Search for resources..."
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
