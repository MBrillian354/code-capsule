import "server-only";
import {
    isValidHttpUrl,
    fetchHtml,
    extractMainContent,
    htmlToMarkdown,
    chunkMarkdown,
    summarizeChunkForLLM,
} from "@/lib/extract";
import { generateCapsuleWithDeepseek } from "@/lib/ai/deepseek";
import { z } from "zod";
import { insertCapsule } from "@/server/repositories/capsules.repo";

export type ProgressUpdate = {
    step: "fetching" | "extracting" | "chunking" | "generating" | "finalizing";
    message: string;
};
export type ProgressCallback = (u: ProgressUpdate) => void;

const CapsulePageSchema = z.object({
    page: z.number(),
    page_title: z.string().optional(),
    body: z.string(),
});
const CapsuleSchema = z.object({
    title: z.string(),
    description: z.string(),
    pages: z.array(CapsulePageSchema).min(1),
});

export async function createCapsuleFromUrlService(params: {
    url: string;
    userId: string;
    onProgress?: ProgressCallback;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
    const { url, userId, onProgress } = params;
    if (!isValidHttpUrl(url)) return { ok: false, error: "Invalid URL" };

    onProgress?.({ step: "fetching", message: "Fetching content from URL..." });
    let html: string;
    try {
        html = await fetchHtml(url);
    } catch {
        return { ok: false, error: "Failed to fetch URL" };
    }

    onProgress?.({ step: "extracting", message: "Extracting main content..." });
    const extracted = extractMainContent(url, html);
    const markdown = htmlToMarkdown(extracted.contentHtml);

    onProgress?.({ step: "chunking", message: "Processing content..." });
    const chunks = chunkMarkdown(markdown);
    const chunkSummaries = chunks.map((c) => ({
        index: c.index,
        text: summarizeChunkForLLM(c.markdown),
    }));

    onProgress?.({
        step: "generating",
        message: "Generating capsule with AI...",
    });
    let generated: unknown;
    try {
        generated = await generateCapsuleWithDeepseek({
            url,
            markdown,
            chunkSummaries,
        });
    } catch {
        return { ok: false, error: "AI generation failed" };
    }

    const parsed = CapsuleSchema.safeParse(generated);
    if (!parsed.success)
        return { ok: false, error: "Generated content invalid" };

    onProgress?.({ step: "finalizing", message: "Saving capsule..." });
    const pages = parsed.data.pages.map((p, i) => ({ ...p, page: i + 1 }));
    const contentForDb = {
        meta: { description: parsed.data.description, source_url: url },
        pages,
    };
    const created_at = new Date().toISOString();

    const { id } = await insertCapsule({
        title: parsed.data.title,
        total_pages: pages.length,
        content: contentForDb,
        created_by: userId,
        created_at,
    });
    return { ok: true, id };
}
