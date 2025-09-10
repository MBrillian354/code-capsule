"use client";

import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import type { CapsuleStatsProps } from "./types";

export default function CapsuleStats({ data }: CapsuleStatsProps) {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
                <Card variant="outlined">
                    <CardContent sx={{ textAlign: "center" }}>
                        <MenuBookIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {data.totalCapsules}+
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Learning Capsules
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <Card variant="outlined">
                    <CardContent sx={{ textAlign: "center" }}>
                        <PersonIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {data.totalContributors}+
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Contributors
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <Card variant="outlined">
                    <CardContent sx={{ textAlign: "center" }}>
                        <AccessTimeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {data.totalPages}+
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Pages
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
