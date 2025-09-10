// Client-side helpers for bookmark functionality

export async function toggleBookmark(capsuleId: string, isBookmarked: boolean) {
    try {
        const response = await fetch("/api/capsule/bookmark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                capsuleId, 
                isBookmarked 
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to toggle bookmark");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Failed to toggle bookmark:", error);
        throw error;
    }
}
