import React from "react";
import { Box, Typography } from "@mui/material";
import { getBookmarkedCapsules, getSession } from "@/lib/dal";
import type { CapsuleCardData } from "@/components/shared/types";
import type { StoredCapsuleContent } from "@/lib/definitions";
import BookmarksClient from "./BookmarksClient";

export default async function BookmarksPage() {
    // Get session for authenticated user
    const session = await getSession();
    
    if (!session.isAuth || !session.userId) {
        return (
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                    Bookmarks
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Please log in to view your bookmarks.
                </Typography>
            </Box>
        );
    }
    
    // Fetch bookmarked capsules
    const bookmarkedCapsules = await getBookmarkedCapsules(session.userId, 20, 0);
    
    // Transform data for components
    const capsuleData: CapsuleCardData[] = bookmarkedCapsules.map((capsule) => {
        const content = capsule.content as StoredCapsuleContent | undefined;
        const description = content?.meta?.description ?? "No description available";
        return {
            id: capsule.id,
            title: capsule.title,
            description,
            total_pages: capsule.total_pages || 0,
            created_at: capsule.created_at,
            creator_name: capsule.creator_name || "Anonymous",
            learn_url: `/dashboard/capsule/${capsule.id}/learn`,
            content: capsule.content,
            bookmarked_date: capsule.bookmarked_date ?? null,
            last_page_read: capsule.last_page_read ?? null,
            overall_progress: capsule.overall_progress ?? null,
        };
    });

    return <BookmarksClient capsules={capsuleData} />;
}
