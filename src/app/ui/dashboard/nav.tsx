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
import {
    Dashboard as DashboardIcon,
    Search as SearchIcon,
    Bookmark as BookmarkIcon,
    Menu as MenuIcon,
    Logout,
} from "@mui/icons-material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";

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
                    <Typography>User Name</Typography>
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={handleClose}
                    component={Link}
                    href="/profile"
                    className="flex items-center gap-2"
                >
                    <PersonOutlineOutlinedIcon fontSize="small" /> Profile
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
