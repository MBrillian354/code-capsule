"use client";

import Image from "next/image";
import Link from "next/link";
import {
    AppBar,
    Toolbar,
    Button,
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import BoltIcon from "@mui/icons-material/Bolt";

export default function Page() {
    return (
        <Box>
            {/* Top bar */}
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
                    <Box>
                        <Button
                            component={Link}
                            href="/login"
                            color="inherit"
                            sx={{ mr: 1 }}
                        >
                            Log in
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Hero */}
            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    background:
                        "radial-gradient(1000px 400px at 20% -10%, rgba(0,112,243,0.12), transparent 60%), radial-gradient(800px 300px at 80% -10%, rgba(99,102,241,0.12), transparent 60%)",
                    borderBottom: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                }}
            >
                <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Chip
                                label="New: Curated Explore feeds"
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <Typography
                                variant="h3"
                                sx={{ fontWeight: 600, lineHeight: 1.1, mb: 2 }}
                            >
                                Learn faster. Save smarter. Explore deeper.
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                CodeCapsule is your personal knowledge hub to
                                capture bookmarks, discover high-signal
                                resources, and keep your learning flow
                                organized.
                            </Typography>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <Button
                                    component={Link}
                                    href="/explore"
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<RocketLaunchIcon />}
                                >
                                    Explore Capsules
                                </Button>
                                <Button
                                    component={Link}
                                    href="/dashboard"
                                    size="large"
                                    variant="outlined"
                                    color="primary"
                                >
                                    View dashboard
                                </Button>
                            </Stack>
                            <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
                                <Stack>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 700 }}
                                    >
                                        1k+
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        resources saved
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 700 }}
                                    >
                                        5x
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        faster discovery
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    aspectRatio: "16/10",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    boxShadow: (theme) => theme.shadows[6],
                                }}
                            >
                                <Image
                                    src="/window.svg"
                                    alt="App preview"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                                    style={{ objectFit: "cover" }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                <Grid container spacing={3}>
                    {[
                        {
                            icon: <BookmarkBorderIcon color="primary" />,
                            title: "Save anything",
                            desc: "Capture articles, docs, and code snippets in one place.",
                        },
                        {
                            icon: <SearchIcon color="primary" />,
                            title: "Explore smarter",
                            desc: "Curated feeds surface what matters to your goals.",
                        },
                        {
                            icon: <SchoolIcon color="primary" />,
                            title: "Learn in focus",
                            desc: "Structured sessions keep progress visible and motivating.",
                        },
                        {
                            icon: <BoltIcon color="primary" />,
                            title: "Super fast",
                            desc: "Next.js 15 + MUI 7 for a snappy, accessible experience.",
                        },
                    ].map((f, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mb: 1,
                                        }}
                                    >
                                        {f.icon}
                                        <Typography
                                            variant="h6"
                                            sx={{ ml: 1, fontWeight: 700 }}
                                        >
                                            {f.title}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {f.desc}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Callout */}
            <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
                <Box
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 2,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Stack spacing={1}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Ready to build your learning hub?
                        </Typography>
                        <Typography color="text.secondary">
                            Join free and start organizing your developer
                            journey today.
                        </Typography>
                    </Stack>
                    <Button
                        component={Link}
                        href="/login?callbackUrl=%2Fdashboard"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<RocketLaunchIcon />}
                    >
                        Create your capsule
                    </Button>
                </Box>
            </Container>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 4,
                    borderTop: (t) => `1px solid ${t.palette.divider}`,
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Image
                            src="/next.svg"
                            alt="Next.js"
                            width={20}
                            height={20}
                        />
                        <Image
                            src="/globe.svg"
                            alt="Globe"
                            width={20}
                            height={20}
                        />
                        <Typography variant="body2" color="text.secondary">
                            Built with Next.js & MUI
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} CodeCapsule
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
