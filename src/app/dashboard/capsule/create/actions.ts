"use server";

import { createCapsuleFromUrl, CreateCapsuleResult } from "@/lib/capsules";
import type { ProgressUpdate } from "@/lib/validators";

export async function createCapsuleWithProgress(
    url: string,
    onProgress: (update: ProgressUpdate) => void
): Promise<CreateCapsuleResult> {
    try {
        const result = await createCapsuleFromUrl(url, (update) => {
            onProgress({
                step: update.step,
                message: update.message
            });
        });
        
        if (result.ok) {
            onProgress({
                step: 'completed',
                message: 'Capsule created successfully!',
                capsuleId: result.id
            });
        } else {
            onProgress({
                step: 'failed',
                message: 'Failed to create capsule',
                error: result.error
            });
        }

        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        onProgress({
            step: 'failed',
            message: 'Failed to create capsule',
            error: errorMessage
        });
        
        return { ok: false, error: errorMessage };
    }
}
