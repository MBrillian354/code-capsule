"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import Nav from "../ui/dashboard/nav";
import type { User } from "@/lib/definitions";

export default function DashboardClient({
    children,
    user,
}: {
    children: React.ReactNode;
    user: User | null;
}) {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: "flex" }} className="max-w-6xl mx-auto">
            <Nav open={open} onToggle={handleDrawerToggle} user={user} />
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
