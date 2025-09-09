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

export default function Page() {
    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
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
                            Continue Reading
                        </Typography>
                        <Card
                            variant="outlined"
                            sx={{ "!important": { paddingBottom: 0 } }}
                        >
                            <CardContent
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minHeight: 140,
                                    "!important": { paddingBottom: 0 },
                                }}
                            >
                                <Typography variant="h6">
                                    Intro to Typescript
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    A concise guide to get you started with
                                    TypeScript — types, interfaces, and tooling.
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
                                            45% completed
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={45}
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
                                <Typography variant="h6">
                                    Access your saved resources quickly.
                                </Typography>
                                <Divider />
                                <Typography variant="h6">
                                    Access your saved resources quickly.
                                </Typography>
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
