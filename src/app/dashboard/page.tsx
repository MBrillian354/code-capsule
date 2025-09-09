"use client";

import React, { Suspense } from "react";
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
    Button,
    Stack,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import {
    continueLearningSample,
    recentlySavedSamples as recentlyCreatedSamples,
} from "./placeholder-data";
import { useActionState } from "react";
import { createCapsule } from "./actions";

export default function Page() {
    const [errorMessage, formAction, isPending] = useActionState(
        createCapsule,
        undefined
    );

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
                            Recently Created
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
                                {recentlyCreatedSamples.map((resource, index) => (
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
                                            recentlyCreatedSamples.length - 1 && (
                                            <Divider />
                                        )}
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid size={12}>
                    <Suspense>
                        <Stack
                            component="form"
                            action={formAction}
                            direction="row"
                            spacing={1}
                        >
                            <TextField
                                name="url"
                                fullWidth
                                variant="outlined"
                                sx={{ backgroundColor: "white", flex: 1 }}
                                placeholder="Enter URL to convert into a capsule..."
                                disabled={isPending}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CodeIcon />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? "Creating..." : "Create"}
                            </Button>
                        </Stack>
                    </Suspense>
                    {errorMessage && (
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{ mt: 1 }}
                        >
                            {errorMessage}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
