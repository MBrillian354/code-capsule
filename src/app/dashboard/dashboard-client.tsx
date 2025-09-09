"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import Nav from "../ui/dashboard/nav";

export default function DashboardClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Nav open={open} onToggle={handleDrawerToggle} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginTop: "64px", // AppBar height
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
