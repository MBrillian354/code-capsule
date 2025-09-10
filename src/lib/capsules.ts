import "server-only";
import { requireUserId } from "@server/auth/session";
import { isValidHttpUrl } from "@/lib/extract";
import { ProgressUpdate } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { createCapsuleFromUrlService } from "@server/services/capsules.service";

export type CreateCapsuleResult =
    | { id: string; ok: true }
    | { ok: false; error: string };

export type ProgressCallback = (update: ProgressUpdate) => void;

export async function createCapsuleFromUrl(
    url: string,
    onProgress?: ProgressCallback
): Promise<CreateCapsuleResult> {
    if (!isValidHttpUrl(url)) return { ok: false, error: "Invalid URL" };

    const userId = await requireUserId();

    const result = await createCapsuleFromUrlService({
        url,
        userId,
        onProgress,
    });

    if (result.ok) {
        try {
            revalidatePath("/explore");
            revalidatePath("/dashboard/explore");
            revalidatePath(`/learn/${result.id}`);
        } catch {
            // ignore
        }
    }

    return result;
}
