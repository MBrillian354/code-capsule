"use client";

import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, LinearProgress, Paper, Stack, Button } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import type { CreateCapsuleApiResult } from "@/types/capsule";
import type { ProgressUpdate, ProgressStep } from "@/lib/validators";
import { stepMessages, stepProgress, stepOrder } from "@/lib/progress-ui";

type ProgressState = {
    step:
        | "fetching"
        | "extracting"
        | "chunking"
        | "generating"
        | "finalizing"
        | "completed"
        | "failed";
    message: string;
    progress: number; // 0-100
    error?: string;
    capsuleId?: string;
};

// messages, order, and progress mapping are imported from shared constants

// Avoid importing server-only modules in client; call API route instead
async function createCapsuleViaApi(
    url: string,
    onProgress: (update: ProgressUpdate) => void
): Promise<CreateCapsuleApiResult> {
    try {
        onProgress({ step: "fetching", message: stepMessages.fetching });

        // Start generation
        onProgress({ step: "generating", message: stepMessages.generating });

        const res = await fetch("/api/capsule/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });

        // Finalizing state before parsing
        onProgress({ step: "finalizing", message: stepMessages.finalizing });

        const data = (await res.json()) as CreateCapsuleApiResult;

        if (data.ok) {
            onProgress({
                step: "completed",
                message: stepMessages.completed,
                capsuleId: data.id,
            });
        } else {
            onProgress({
                step: "failed",
                message: stepMessages.failed,
                error: data.error,
            });
        }
        return data;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
        onProgress({
            step: "failed",
            message: stepMessages.failed,
            error: errorMessage,
        });
        return { ok: false, error: errorMessage };
    }
}

async function createCapsuleViaSse(
    url: string,
    onProgress: (update: ProgressUpdate) => void
): Promise<CreateCapsuleApiResult> {
    try {
        const resp = await fetch(
            `/api/capsule/create/stream?url=${encodeURIComponent(url)}`,
            {
                method: "GET",
                headers: { Accept: "text/event-stream" },
            }
        );

        if (!resp.ok || !resp.body) {
            return { ok: false, error: "Failed to start stream" };
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let result: CreateCapsuleApiResult | undefined;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let idx;
            while ((idx = buffer.indexOf("\n\n")) !== -1) {
                const chunk = buffer.slice(0, idx);
                buffer = buffer.slice(idx + 2);

                const lines = chunk.split("\n");
                let event: string | undefined;
                let dataStr = "";
                for (const line of lines) {
                    if (line.startsWith("event:")) event = line.slice(6).trim();
                    if (line.startsWith("data:"))
                        dataStr += line.slice(5).trim();
                }

                if (!event) continue;
                try {
                    const data = dataStr ? JSON.parse(dataStr) : undefined;
                    if (event === "progress" && data)
                        onProgress(data as ProgressUpdate);
                    if (event === "completed" && data?.id)
                        result = { ok: true, id: data.id };
                    if (event === "failed" && data?.error)
                        result = { ok: false, error: data.error };
                } catch {
                    // ignore malformed chunks
                }
            }
        }

        return result ?? { ok: false, error: "Stream ended unexpectedly" };
    } catch (err) {
        return {
            ok: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

export default function CreateCapsulePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const url = searchParams.get("url");
    const [progress, setProgress] = useState<ProgressState>({
        step: "fetching",
        message: stepMessages.fetching,
        progress: 0,
    });
    const [isProcessing, setIsProcessing] = useState(true);
    const hasStarted = useRef(false);

    const steps: { key: ProgressStep; label: string; icon: string }[] = [
        { key: "fetching", label: "Fetching content from URL...", icon: "🌐" },
        { key: "extracting", label: "Extracting main content...", icon: "📄" },
        { key: "chunking", label: "Processing content...", icon: "⚙️" },
        {
            key: "generating",
            label: "Generating capsule with AI...",
            icon: "🤖",
        },
        { key: "finalizing", label: "Saving capsule...", icon: "💾" },
        {
            key: "completed",
            label: "Capsule created successfully!",
            icon: "✅",
        },
        { key: "failed", label: "Failed to create capsule", icon: "❌" },
    ];

    // stepOrder imported from shared constants

    useEffect(() => {
        // Warn user if they try to leave during processing
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isProcessing) {
                e.preventDefault();
                e.returnValue =
                    "Creating capsule in progress. Leaving will abort the process.";
                return "Creating capsule in progress. Leaving will abort the process.";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isProcessing]);

    useEffect(() => {
        if (!url) {
            alert("No URL provided. Redirecting to dashboard.");
            router.push("/dashboard");
            return;
        }

        if (hasStarted.current) return;
        hasStarted.current = true;

        const startCreation = async () => {
            try {
                const useStreaming = true;
                const runner = useStreaming
                    ? createCapsuleViaSse
                    : createCapsuleViaApi;

                const result = await runner(
                    url,
                    (progressUpdate: ProgressUpdate) => {
                        setProgress({
                            step: progressUpdate.step,
                            message: progressUpdate.message,
                            progress:
                                stepProgress[
                                    progressUpdate.step as keyof typeof stepProgress
                                ],
                            error: progressUpdate.error,
                            capsuleId: progressUpdate.capsuleId,
                        });
                    }
                );

                setIsProcessing(false);

                if (result.ok) {
                    setProgress({
                        step: "completed",
                        message: stepMessages.completed,
                        progress: 100,
                        capsuleId: result.id,
                    });
                } else {
                    setProgress({
                        step: "failed",
                        message: stepMessages.failed,
                        progress: 0,
                        error: result.error,
                    });
                }
            } catch (error) {
                setIsProcessing(false);
                setProgress({
                    step: "failed",
                    message: stepMessages.failed,
                    progress: 0,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unknown error occurred",
                });
            }
        };

        startCreation();
    }, [url, router]);

    const handleRedirectToDashboard = () => {
        router.push("/dashboard");
    };

    const visibleSteps = steps.filter((step) => {
        const stepIndex = stepOrder.indexOf(step.key);
        const progressIndex = stepOrder.indexOf(progress.step);
        const isCompleted =
            step.key === "completed" && progress.step === "completed";
        const isFailed = step.key === "failed" && progress.step === "failed";
        const isActive = progress.step === step.key;
        const isPast = stepIndex < progressIndex;
        return isPast || isActive || isCompleted || isFailed;
    });

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 600, mb: 3 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    align="center"
                >
                    Creating Capsule
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                >
                    URL: {url}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={progress.progress}
                    sx={{ height: 8, borderRadius: 4, mt: 2 }}
                />
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    className="animate-pulse"
                    sx={{ mt: 1 }}
                >
                    {progress.progress}% completed
                </Typography>
                {/*time elapsed*/}
            </Box>

            <Stack spacing={2} sx={{ width: "100%", maxWidth: 600 }}>
                {visibleSteps.map((step) => {
                    const isCompleted =
                        step.key === "completed" &&
                        progress.step === "completed";
                    const isFailed =
                        step.key === "failed" && progress.step === "failed";
                    const isActive = progress.step === step.key;
                    const isPast =
                        stepOrder.indexOf(step.key) <
                        stepOrder.indexOf(progress.step);

                    return (
                        <Paper
                            key={step.key}
                            elevation={isActive ? 6 : 2}
                            sx={{
                                p: 3,
                                transition: "all 0.5s ease",
                                transform:
                                    isPast || isCompleted || isFailed
                                        ? "translateY(0)"
                                        : "translateY(20px)",
                                opacity:
                                    isPast ||
                                    isCompleted ||
                                    isFailed ||
                                    isActive
                                        ? 1
                                        : 0.5,
                                backgroundColor: isCompleted
                                    ? "success.light"
                                    : isFailed
                                    ? "error.light"
                                    : "background.paper",
                                border: isActive ? "2px solid" : "none",
                                borderColor: "primary.main",
                                "&:hover": {
                                    elevation: 4,
                                },
                            }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                            >
                                <Typography variant="h5">
                                    {step.icon}
                                </Typography>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: isActive
                                                ? "bold"
                                                : "normal",
                                        }}
                                    >
                                        {step.label}
                                    </Typography>
                                    {isActive && !isCompleted && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            className="animate-pulse"
                                        >
                                            In progress...
                                        </Typography>
                                    )}
                                    {isCompleted && (
                                        <Typography
                                            variant="body2"
                                            color="success.main"
                                        >
                                            Done!
                                        </Typography>
                                    )}
                                    {isFailed && progress.error && (
                                        <Typography
                                            variant="body2"
                                            color="error.main"
                                        >
                                            Error: {progress.error}
                                        </Typography>
                                    )}
                                </Box>
                                {(isPast || isCompleted) && !isFailed && (
                                    <Typography
                                        variant="h6"
                                        color="success.main"
                                    >
                                        ✓
                                    </Typography>
                                )}
                                {isFailed && (
                                    <Typography variant="h6" color="error.main">
                                        ✗
                                    </Typography>
                                )}
                            </Stack>
                        </Paper>
                    );
                })}
            </Stack>

            {!isProcessing && (
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleRedirectToDashboard}
                    sx={{ mt: 3 }}
                >
                    Back to Dashboard
                </Button>
            )}
        </Box>
    );
}
