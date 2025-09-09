export type ProgressUpdate = {
    step: 'fetching' | 'extracting' | 'chunking' | 'generating' | 'finalizing' | 'completed' | 'failed';
    message: string;
    error?: string;
    capsuleId?: string;
};

export type ProgressState = {
    step: 'fetching' | 'extracting' | 'chunking' | 'generating' | 'finalizing' | 'completed' | 'failed';
    message: string;
    progress: number; // 0-100
    error?: string;
    capsuleId?: string;
};
