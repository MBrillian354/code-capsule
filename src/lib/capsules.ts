import "server-only";
import { getSession } from "@/lib/dal";
import {
    isValidHttpUrl,
    fetchHtml,
    extractMainContent,
    htmlToMarkdown,
    chunkMarkdown,
    summarizeChunkForLLM,
} from "@/lib/extract";
import { generateCapsuleWithDeepseek } from "@/lib/ai/deepseek";
import { CapsuleSchema } from "@/lib/validators";
import { insertCapsule } from "@/lib/dal";

export type CreateCapsuleResult =
    | { id: string; ok: true }
    | { ok: false; error: string };

export type ProgressCallback = (update: {
    step: 'fetching' | 'extracting' | 'chunking' | 'generating' | 'finalizing';
    message: string;
}) => void;

export async function createCapsuleFromUrl(
    url: string,
    onProgress?: ProgressCallback
): Promise<CreateCapsuleResult> {
    if (!isValidHttpUrl(url)) return { ok: false, error: "Invalid URL" };

    console.log("[Create Capsule From URL] URL received:", url);
    const session = await getSession();
    console.log("Current session:", session);

    if (!session.isAuth || !session.userId) {
        console.log(
            "[Create Capsule From URL] Unauthorized access attempt",
            session
        );
        return { ok: false, error: "Unauthorized" };
    }

    onProgress?.({
        step: 'fetching',
        message: 'Fetching content from URL...'
    });

    let html: string;
    try {
        html = await fetchHtml(url);
    } catch (e) {
        return { ok: false, error: "Failed to fetch URL" };
    }

    onProgress?.({
        step: 'extracting',
        message: 'Extracting main content...'
    });

    const extracted = extractMainContent(url, html);
    const markdown = htmlToMarkdown(extracted.contentHtml);
    
    onProgress?.({
        step: 'chunking',
        message: 'Processing content...'
    });
    
    const chunks = chunkMarkdown(markdown);
    const chunkSummaries = chunks.map((c) => ({
        index: c.index,
        text: summarizeChunkForLLM(c.markdown),
    }));

    onProgress?.({
        step: 'generating',
        message: 'Generating capsule with AI...'
    });

    let generated;
    try {
        generated = await generateCapsuleWithDeepseek({
            url,
            markdown,
            chunkSummaries,
        });
    } catch (e) {
        return { ok: false, error: "AI generation failed" };
    }

    const parsed = CapsuleSchema.safeParse(generated);
    if (!parsed.success) {
        return { ok: false, error: "Generated content invalid" };
    }

    onProgress?.({
        step: 'finalizing',
        message: 'Saving capsule...'
    });

    const pages = parsed.data.pages.map((p, i) => ({ ...p, page: i + 1 }));

    const contentForDb = {
        meta: { description: parsed.data.description, source_url: url },
        pages,
    };

    const { id } = await insertCapsule({
        title: parsed.data.title,
        total_pages: pages.length,
        content: contentForDb,
        created_by: session.userId!,
    });

    return { ok: true, id };
}
