import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Avatar,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    Search as SearchIcon,
    Bookmark as BookmarkIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/dashboard", icon: DashboardIcon, primary: "Dashboard" },
    { href: "/dashboard/explore", icon: SearchIcon, primary: "Explore" },
    { href: "/dashboard/bookmarks", icon: BookmarkIcon, primary: "Saved" },
];

export const drawerWidthOpen = 240;
export const drawerWidthClosed = 60;

export default function Nav({
    open,
    onToggle,
}: {
    open: boolean;
    onToggle: () => void;
}) {
    const pathname = usePathname();

    const drawer = (
        <Box className="py-20">
            <List>
                {navItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <Link href={item.href} className="w-full">
                            <ListItemButton
                                sx={{
                                    ...(pathname === item.href && {
                                        backgroundColor: "primary.main",
                                        color: "primary.contrastText",
                                        "& .MuiListItemIcon-root": {
                                            color: "primary.contrastText",
                                        },
                                    }),
                                }}
                            >
                                <ListItemIcon>
                                    <item.icon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.primary}
                                    sx={(theme) => ({
                                        opacity: open ? 1 : 0,
                                        whiteSpace: "nowrap",
                                        width: open ? "auto" : 0,
                                        overflow: "hidden",
                                        transition: theme.transitions.create(
                                            "opacity",
                                            {
                                                duration:
                                                    theme.transitions.duration
                                                        .shortest,
                                            }
                                        ),
                                    })}
                                />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={onToggle}
                        edge="start"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, ml: 2 }}
                    >
                        CodeCapsule
                    </Typography>
                    <Avatar sx={{ bgcolor: "secondary.main" }} />
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                anchor="left"
                open={open}
                sx={(theme) => ({
                    width: open ? drawerWidthOpen : drawerWidthClosed,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    transition: theme.transitions.create("width", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    "& .MuiDrawer-paper": {
                        width: open ? drawerWidthOpen : drawerWidthClosed,
                        boxSizing: "border-box",
                        overflowX: "hidden",
                        transition: theme.transitions.create("width", {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    },
                })}
            >
                {drawer}
            </Drawer>
        </>
    );
}
