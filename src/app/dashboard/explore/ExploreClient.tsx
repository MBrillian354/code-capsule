"use client";

import React, { useState } from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    IconButton,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Logout,
    PersonOutlineOutlined as PersonOutlineOutlinedIcon,
} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/app/login/actions";
import type { User } from "@/lib/definitions";

export default function ExploreClient({
    children,
    user,
}: {
    children: React.ReactNode;
    user: User | null;
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 3 },
                    maxWidth: "1200px",
                    mx: "auto",
                    width: "100%",
                }}
            >
                {children}
            </Box>

            {/* User Menu */}
            {user && (
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: "visible",
                                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                mt: 1.5,
                                minHeight: 150,
                                minWidth: 200,
                                "& .MuiAvatar-root": {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                "&::before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: "background.paper",
                                    transform: "translateY(-50%) rotate(45deg)",
                                    zIndex: 0,
                                },
                            },
                        },
                    }}
                >
                    <MenuItem
                        onClick={handleClose}
                        component={Link}
                        href="/dashboard"
                        className="flex items-center gap-2"
                    >
                        <Avatar sx={{ bgcolor: "secondary.main" }} />
                        <Typography>{user?.name || "User"}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={handleClose}
                        component={Link}
                        href="/profile"
                        className="flex items-center gap-2"
                    >
                        <PersonOutlineOutlinedIcon fontSize="small" /> My
                        Account
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            handleLogout();
                        }}
                        className="flex items-center gap-2 !text-danger"
                    >
                        <Logout fontSize="small" /> Logout
                    </MenuItem>
                </Menu>
            )}
        </Box>
    );
}
