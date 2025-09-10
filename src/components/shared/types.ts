// Shared types for components

export interface PublicCapsule {
    id: string;
    title: string;
    total_pages: number;
    created_at: string;
    content: unknown;
    creator_name?: string;
    created_by?: string;
}

export interface CapsuleWithProgress extends PublicCapsule {
    last_page_read?: number | null;
    overall_progress?: number | null;
    bookmarked_date?: string | null;
    last_accessed?: string | null;
}

export interface CapsuleCardData {
    id: string;
    title: string;
    description: string;
    total_pages: number;
    created_at: string;
    creator_name?: string;
    learn_url: string;
    content: unknown; // Keep content for backward compatibility with CapsuleCard
    bookmarked_date?: string | null;
    last_page_read?: number | null;
    overall_progress?: number | null;
}

export interface CapsuleStatsData {
    totalCapsules: number;
    totalContributors: number;
    totalPages: number;
}

export interface EmptyStateProps {
    title: string;
    description: string;
    actionButton?: {
        text: string;
        href: string;
    };
}

export interface CapsuleGridProps {
    capsules: CapsuleCardData[];
    emptyStateProps?: EmptyStateProps;
    showBookmarkButton?: boolean;
    showProgress?: boolean;
}

export interface CapsuleStatsProps {
    data: CapsuleStatsData;
}
