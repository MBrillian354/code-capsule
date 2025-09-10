import "server-only";
import OpenAI from "openai";

// OpenAI-compatible client for DeepSeek
// Requires env var DEEPSEEK_API_KEY
// Optional: DEEPSEEK_BASE_URL (defaults to https://api.deepseek.com/v1)

// Note: OpenAI SDK expects the base URL to already include the version segment (e.g., /v1)
const baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1";

export function createDeepseekClient() {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        throw new Error("DEEPSEEK_API_KEY is not set");
    }
    return new OpenAI({ apiKey, baseURL });
}

export type CapsulePage = { page: number; page_title: string; body: string };

export type CapsuleGen = {
    title: string;
    description: string;
    pages: CapsulePage[];
};

export async function generateCapsuleWithDeepseek(input: {
    url: string;
    markdown: string;
    chunkSummaries: { index: number; text: string }[];
    model?: string;
}): Promise<CapsuleGen> {
    console.log("generateCapsuleWithDeepseek: Starting with input:", {
        url: input.url,
        markdownLength: input.markdown.length,
        chunkSummariesCount: input.chunkSummaries.length,
        model: input.model,
    });
    const model = input.model || "deepseek-chat";

    const system = `You are a senior technical editor who transforms articles into structured learning capsules that guides learners in a step-by-step manner.
- Produce concise, accurate, cohesive, well-formatted Markdown.
- Keep code fences and lists where appropriate.
- Be informative to fill missing information while avoiding hallucination.
- Use neutral tone.
`;

    // Single JSON response containing title, description, and pages.
    const user = JSON.stringify({
        task: "Create capsule",
        url: input.url,
        article_markdown: input.markdown,
        chunks: input.chunkSummaries,
        required_schema: {
            title: "string",
            description: "string",
            pages: [
                {
                    page: "number",
                    page_title: "string",
                    body: "markdown string",
                },
            ],
        },
        rules: [
            "Return strict JSON only with keys: title, description, pages",
            "pages must start at page = 1 and be sequential",
            "page_title <= 60 chars; body is Markdown",
            "No commentary outside JSON",
        ],
    });

    console.log("generateCapsuleWithDeepseek: Creating DeepSeek client");
    const client = createDeepseekClient();
    console.log("generateCapsuleWithDeepseek: Client created successfully");
    console.log(
        "generateCapsuleWithDeepseek: Sending request to AI with model:",
        model
    );
    let resp;
    try {
        resp = await client.chat.completions.create({
            model,
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
            temperature: 0.3,
            response_format: { type: "json_object" },
        });
    } catch (e: unknown) {
        const err = e as any;
        console.error("generateCapsuleWithDeepseek: API error", {
            name: err?.name,
            message: err?.message,
            status: err?.status,
            code: err?.code,
            data: err?.data,
        });
        throw err;
    }

    console.log("generateCapsuleWithDeepseek: Received response from AI");
    const content = resp.choices?.[0]?.message?.content || "{}";
    console.log(
        "generateCapsuleWithDeepseek: Raw content length:",
        content.length
    );
    console.log("generateCapsuleWithDeepseek: Parsing JSON response");
    let parsed: CapsuleGen;
    try {
        parsed = JSON.parse(content);
    } catch (e) {
        console.error("generateCapsuleWithDeepseek: JSON parse failed", {
            sample: content.slice(0, 200),
        });
        throw e;
    }
    console.log(
        "generateCapsuleWithDeepseek: Successfully parsed response, returning capsule with title:",
        parsed.title
    );
    return parsed;
}
