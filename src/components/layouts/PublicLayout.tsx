"use client";

import React from "react";
import { Box, AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            {/* Top Navigation Bar */}
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Image
                            src="/vercel.svg"
                            alt="Logo"
                            width={24}
                            height={24}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            CodeCapsule
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Button component={Link} href="/login" color="inherit">
                            Log in
                        </Button>
                        <Button
                            component={Link}
                            href="/signup"
                            variant="contained"
                            color="primary"
                            size="small"
                        >
                            Sign up
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 3 },
                    width: "100%",
                }}
                className="max-w-6xl mx-auto"
            >
                {children}
            </Box>
        </Box>
    );
}
