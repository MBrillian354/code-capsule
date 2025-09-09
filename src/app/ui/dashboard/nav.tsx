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

export const drawerWidthOpen = 240;
export const drawerWidthClosed = 60;

export default function Nav({
    open,
    onToggle,
}: {
    open: boolean;
    onToggle: () => void;
}) {
    const drawer = (
        <Box className="py-20">
            <List>
                <ListItem disablePadding>
                    <Link href="/dashboard">
                        <ListItemButton component="a">
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Dashboard"
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
                <ListItem disablePadding>
                    <Link href="/dashboard/explore" passHref legacyBehavior>
                        <ListItemButton component="a">
                            <ListItemIcon>
                                <SearchIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Explore"
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
                <ListItem disablePadding>
                    <Link href="/dashboard/bookmarks" passHref legacyBehavior>
                        <ListItemButton component="a">
                            <ListItemIcon>
                                <BookmarkIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Saved"
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
