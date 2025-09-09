"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Typography,
    LinearProgress,
    Paper,
    Stack,
    Button,
    CircularProgress,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import type { CreateCapsuleApiResult, ProgressUpdate } from "@/types/capsule";

type ProgressState = {
    step: 'fetching' | 'extracting' | 'chunking' | 'generating' | 'finalizing' | 'completed' | 'failed';
    message: string;
    progress: number; // 0-100
    error?: string;
    capsuleId?: string;
};

const stepMessages = {
    fetching: "Fetching content from URL...",
    extracting: "Extracting main content...",
    chunking: "Processing content...",
    generating: "Generating capsule with AI...",
    finalizing: "Saving capsule...",
    completed: "Capsule created successfully!",
    failed: "Failed to create capsule"
};

const stepProgress = {
    fetching: 20,
    extracting: 40,
    chunking: 60,
    generating: 80,
    finalizing: 95,
    completed: 100,
    failed: 0
};

// Avoid importing server-only modules in client; call API route instead
async function createCapsuleViaApi(
    url: string,
    onProgress: (update: ProgressUpdate) => void
): Promise<CreateCapsuleApiResult> {
    try {
        onProgress({ step: 'fetching', message: stepMessages.fetching });

        // Start generation
        onProgress({ step: 'generating', message: stepMessages.generating });

        const res = await fetch('/api/capsule/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        // Finalizing state before parsing
        onProgress({ step: 'finalizing', message: stepMessages.finalizing });

    const data = (await res.json()) as CreateCapsuleApiResult;

        if (data.ok) {
            onProgress({ step: 'completed', message: stepMessages.completed, capsuleId: data.id });
        } else {
            onProgress({ step: 'failed', message: stepMessages.failed, error: data.error });
        }
        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        onProgress({ step: 'failed', message: stepMessages.failed, error: errorMessage });
        return { ok: false, error: errorMessage };
    }
}

async function createCapsuleViaSse(
    url: string,
    onProgress: (update: ProgressUpdate) => void
) : Promise<CreateCapsuleApiResult> {
    try {
        const resp = await fetch(`/api/capsule/create/stream?url=${encodeURIComponent(url)}`, {
            method: 'GET',
            headers: { Accept: 'text/event-stream' },
        })

        if (!resp.ok || !resp.body) {
            return { ok: false, error: 'Failed to start stream' }
        }

        const reader = resp.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let result: CreateCapsuleApiResult | undefined

        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })

            let idx
            while ((idx = buffer.indexOf('\n\n')) !== -1) {
                const chunk = buffer.slice(0, idx)
                buffer = buffer.slice(idx + 2)

                const lines = chunk.split('\n')
                let event: string | undefined
                let dataStr = ''
                for (const line of lines) {
                    if (line.startsWith('event:')) event = line.slice(6).trim()
                    if (line.startsWith('data:')) dataStr += line.slice(5).trim()
                }

                if (!event) continue
                try {
                    const data = dataStr ? JSON.parse(dataStr) : undefined
                    if (event === 'progress' && data) onProgress(data as ProgressUpdate)
                    if (event === 'completed' && data?.id) result = { ok: true, id: data.id }
                    if (event === 'failed' && data?.error) result = { ok: false, error: data.error }
                } catch {
                    // ignore malformed chunks
                }
            }
        }

        return result ?? { ok: false, error: 'Stream ended unexpectedly' }
    } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }
}

export default function CreateCapsulePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const url = searchParams.get('url');
    const [progress, setProgress] = useState<ProgressState>({
        step: 'fetching',
        message: stepMessages.fetching,
        progress: 0
    });
    const [isProcessing, setIsProcessing] = useState(true);
    const hasStarted = useRef(false);

    useEffect(() => {
        // Warn user if they try to leave during processing
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isProcessing) {
                e.preventDefault();
                e.returnValue = 'Creating capsule in progress. Leaving will abort the process.';
                return 'Creating capsule in progress. Leaving will abort the process.';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isProcessing]);

    useEffect(() => {
        if (!url) {
            alert('No URL provided. Redirecting to dashboard.');
            router.push('/dashboard');
            return;
        }

        if (hasStarted.current) return;
        hasStarted.current = true;

    const startCreation = async () => {
            try {
        const useStreaming = true
        const runner = useStreaming ? createCapsuleViaSse : createCapsuleViaApi

        const result = await runner(url, (progressUpdate: ProgressUpdate) => {
                    setProgress({
                        step: progressUpdate.step,
                        message: progressUpdate.message,
                        progress: stepProgress[progressUpdate.step as keyof typeof stepProgress],
                        error: progressUpdate.error,
                        capsuleId: progressUpdate.capsuleId
                    });
                });

                setIsProcessing(false);

                if (result.ok) {
                    setProgress({
                        step: 'completed',
                        message: stepMessages.completed,
                        progress: 100,
                        capsuleId: result.id
                    });
                } else {
                    setProgress({
                        step: 'failed',
                        message: stepMessages.failed,
                        progress: 0,
                        error: result.error
                    });
                }
            } catch (error) {
                setIsProcessing(false);
                setProgress({
                    step: 'failed',
                    message: stepMessages.failed,
                    progress: 0,
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                });
            }
        };

        startCreation();
    }, [url, router]);

    const handleRedirectToDashboard = () => {
        router.push('/dashboard');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default',
                p: 3
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 600,
                    width: '100%',
                    textAlign: 'center'
                }}
            >
                <Stack spacing={3}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Creating Capsule
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary">
                        URL: {url}
                    </Typography>

                    {isProcessing && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <CircularProgress size={40} />
                        </Box>
                    )}

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {progress.message}
                        </Typography>
                        
                        <LinearProgress
                            variant="determinate"
                            value={progress.progress}
                            sx={{ height: 8, borderRadius: 4, mb: 1 }}
                        />
                        
                        <Typography variant="body2" color="text.secondary">
                            {progress.progress}% completed
                        </Typography>
                    </Box>

                    {progress.step === 'failed' && progress.error && (
                        <Typography variant="body2" color="error">
                            Error: {progress.error}
                        </Typography>
                    )}

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
                </Stack>
            </Paper>
        </Box>
    );
}
