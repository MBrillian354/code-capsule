"use client";

import React from "react";
import {
    Box,
    Button,
    Card,
    LinearProgress,
    Typography,
    Alert,
    Stack,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { marked } from "marked";
import Link from "next/link";
import type { CapsuleClient } from "@/types/capsule";
import {
    computeProgress,
    getSavedProgress,
    setSavedProgress,
} from "@/lib/client/capsuleProgress";

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function PublicLearnClient({
    capsule,
}: {
    capsule: CapsuleClient;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = capsule.content.length;
    const initialFromQuery = Number(searchParams.get("p")) || 0;
    const saved = getSavedProgress(capsule.id);

    const initialPage = clamp(
        initialFromQuery || saved?.last_page_read || 1,
        1,
        totalPages
    );

    const [page, setPage] = React.useState<number>(initialPage);
    const [progress, setProgress] = React.useState<number>(
        computeProgress(Math.max(saved?.last_page_read || 0, page), totalPages)
    );

    // Sync URL when page changes
    React.useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("p", String(page));
        router.replace(`${pathname}?${params.toString()}`);

        // Update progress state
        const newLast = Math.max(saved?.last_page_read || 0, page);
        const newProgress = computeProgress(newLast, totalPages);
        setProgress(newProgress);

        // Save to localStorage for immediate feedback (guest users)
        setSavedProgress(capsule.id, {
            last_page_read: newLast,
            overall_progress: newProgress,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // Clamp to valid page if query outside range
    React.useEffect(() => {
        const p = Number(searchParams.get("p"));
        if (!p) return;
        const clamped = clamp(p, 1, totalPages);
        if (clamped !== page) setPage(clamped);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const current =
        capsule.content.find((c) => c.page === page) || capsule.content[0];

    const goPrev = () => setPage((p) => clamp(p - 1, 1, totalPages));
    const goNext = () => setPage((p) => clamp(p + 1, 1, totalPages));

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 6 }}>
            {/* Authentication notice for non-authenticated users */}
            <Alert
                severity="info"
                sx={{
                    borderRadius: 2,
                    "& .MuiAlert-message": { width: "100%" },
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                >
                    <Typography variant="body2">
                        You&apos;re reading as a guest. Sign up to save your
                        progress and create your own capsules!
                    </Typography>
                </Stack>
            </Alert>

            {/* Sticky progress/header bar */}
            <Card
                elevation={1}
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: (t) => t.zIndex.appBar - 1,
                    backgroundColor: "white",
                    borderBottom: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    px: { xs: 2, md: 3 },
                    py: 1.5,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                        >
                            {capsule.title}
                        </Typography>
                        <Typography variant="subtitle2">
                            {current.page_title || `Page ${page}`}
                        </Typography>
                        {capsule.creator_name && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                by {capsule.creator_name}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" color="text.secondary">
                            Chapter {page}/{totalPages}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {Math.round(progress)}% complete
                        </Typography>
                    </Box>
                </Box>
                <LinearProgress variant="determinate" value={progress} />
            </Card>

            {/* Content */}
            <Card
                elevation={0}
                variant="outlined"
                sx={{
                    pt: 2,
                    pb: 4,
                    px: { xs: 2, md: 5 },
                    backgroundColor: "white",
                }}
            >
                <article
                    className="markdown"
                    // We trust placeholder content here; in production sanitize.
                    dangerouslySetInnerHTML={{
                        __html: marked.parse(current.body) as string,
                    }}
                    style={{
                        lineHeight: 1.7,
                        fontSize: "1.05rem",
                    }}
                />

                {/* Pager */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 3,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={goPrev}
                        disabled={page <= 1}
                    >
                        Previous
                    </Button>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            component={Link}
                            href="/explore"
                            variant="outlined"
                            size="small"
                        >
                            Back to Explore
                        </Button>
                        <Button
                            variant="contained"
                            onClick={goNext}
                            disabled={page >= totalPages}
                        >
                            {page >= totalPages ? "Finish" : "Next"}
                        </Button>
                    </Stack>
                </Box>
            </Card>
        </Box>
    );
}
