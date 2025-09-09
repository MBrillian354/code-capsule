"use client";

import React from "react";
import { Box, Button, Card, LinearProgress, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { marked } from "marked";

type CapsulePage = { page: number; body: string };

export type CapsuleClient = {
    id: string;
    title: string;
    description: string;
    content: CapsulePage[];
    last_page_read?: number;
    overall_progress?: number;
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function ReaderClient({ capsule }: { capsule: CapsuleClient }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = capsule.content.length;
    const initialFromQuery = Number(searchParams.get("p")) || 0;
    const saved = getSavedProgress(capsule.id);

    const initialPage = clamp(
        initialFromQuery ||
            saved?.last_page_read ||
            capsule.last_page_read ||
            1,
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
        // Save progress (optimistic)
        const newLast = Math.max(saved?.last_page_read || 0, page);
        const newProgress = computeProgress(newLast, totalPages);
        setProgress(newProgress);
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
            {/* Sticky progress/header bar */}
            <Card
                elevation={1}
                sx={{
                    position: "sticky",
                    top: 64,
                    zIndex: (t) => t.zIndex.appBar - 1,
                    backgroundColor: "white",
                    borderBottom: 1,
                    borderColor: "divider",
                    borderRadius: 24,
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
                        <Typography
                            variant="subtitle2"
                        >
                            {"current.page_title"}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {/* Chapter {page} | {Math.round(progress)}% */}
                        Chapter {page}/{totalPages} • {Math.round(progress)}%
                    </Typography>
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
                    px: { xs: 3, md: 5 },
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
                    <Button
                        variant="contained"
                        onClick={goNext}
                        disabled={page >= totalPages}
                    >
                        {page >= totalPages ? "Finish" : "Next"}
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}

function computeProgress(lastPage: number, total: number) {
    if (!total) return 0;
    return Math.min(100, Math.max(0, (lastPage / total) * 100));
}

type ProgressSave = { last_page_read: number; overall_progress: number };

function storageKey(id: string) {
    return `capsule-progress:${id}`;
}

function getSavedProgress(id: string): ProgressSave | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(storageKey(id));
        return raw ? (JSON.parse(raw) as ProgressSave) : null;
    } catch {
        return null;
    }
}

function setSavedProgress(id: string, data: ProgressSave) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(storageKey(id), JSON.stringify(data));
    } catch {
        // no-op
    }
}
