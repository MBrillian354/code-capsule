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
    Menu,
    MenuItem,
    Divider,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import ExploreIcon from "@mui/icons-material/ExploreOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkBorderOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import Logout from "@mui/icons-material/Logout";
import ViewAgendaOutlined from "@mui/icons-material/ViewAgendaOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { clearUserData } from "@/lib/clearClientData";
import type { User } from "@/lib/definitions";

const navItems = [
    { href: "/dashboard", icon: DashboardIcon, primary: "Dashboard" },
    { href: "/dashboard/explore", icon: ExploreIcon, primary: "Explore" },
    { href: "/dashboard/bookmarks", icon: BookmarkIcon, primary: "Bookmarks" },
    {
        href: "/dashboard/capsules/me",
        icon: ViewAgendaOutlined,
        primary: "My Capsules",
    },
];

export const drawerWidthOpen = 240;
export const drawerWidthClosed = 60;

export default function Nav({
    open,
    onToggle,
    user,
}: {
    open: boolean;
    onToggle: () => void;
    user: User | null;
}) {
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleMenu = (_event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(_event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        // Clear browser data first (best-effort), then call server logout
        try {
            await clearUserData();
        } catch {
            // don't block logout on client-side cleanup
        }
        await logout();
    };

    const drawer = (
        <Box className="py-20">
            <List>
                {navItems.map((item, index) => (
                    <ListItem onClick={handleClose} key={index} disablePadding>
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
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleMenu}
                        edge="start"
                    >
                        <Avatar sx={{ bgcolor: "secondary.main" }} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                anchor="left"
                open={open}
                onClose={isMobile ? onToggle : undefined}
                ModalProps={isMobile ? { keepMounted: true } : undefined}
                sx={(theme) => ({
                    width: isMobile
                        ? undefined
                        : open
                        ? drawerWidthOpen
                        : drawerWidthClosed,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    transition: theme.transitions.create("width", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    "& .MuiDrawer-paper": {
                        width: isMobile
                            ? drawerWidthOpen
                            : open
                            ? drawerWidthOpen
                            : drawerWidthClosed,
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
                    disabled={true}
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
                    disabled={true}
                >
                    <PersonOutlineOutlinedIcon fontSize="small" /> My Account
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
        </>
    );
}
