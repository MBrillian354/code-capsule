import React from "react";
import { Box, Typography } from "@mui/material";
import { getBookmarkedCapsules, getSession } from "@/lib/dal";
import type { CapsuleCardData } from "@/components/shared/types";
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
    const capsuleData: CapsuleCardData[] = bookmarkedCapsules.map(capsule => ({
        id: capsule.id,
        title: capsule.title,
        description: capsule.content && typeof capsule.content === 'object' && 'meta' in capsule.content 
            ? (capsule.content as any).meta?.description || "No description available"
            : "No description available",
        total_pages: capsule.total_pages || 0,
        created_at: capsule.created_at,
        creator_name: capsule.creator_name || "Anonymous",
        learn_url: `/dashboard/capsule/${capsule.id}/learn`,
        content: capsule.content, // Keep the original content for the card component
        bookmarked_date: (capsule as any).bookmarked_date || null,
        last_page_read: (capsule as any).last_page_read || null,
        overall_progress: (capsule as any).overall_progress || null,
    }));

    return <BookmarksClient capsules={capsuleData} />;
}
