export interface CourseProgress {
    id: string;
    title: string;
    description: string;
    overall_progress: number;
}

export interface SavedResource {
    id: string;
    title: string;
    description: string;
}

export const continueLearningSample: CourseProgress = {
    id: "0",
    title: "Intro to Typescript",
    description: "A concise guide to get you started with TypeScript — types, interfaces, and tooling.",
    overall_progress: 24.6,
};

export const recentlySavedSamples: SavedResource[] = [
    {
        id: "1",
        title: "React Hooks Guide",
        description: "Learn how to use useState, useEffect, and other hooks in React applications.",
    },
    {
        id: "2",
        title: "Node.js Best Practices",
        description: "Essential tips for building scalable and secure Node.js applications.",
    },
    {
        id: "3",
        title: "Advanced TypeScript Patterns",
        description: "Master advanced TypeScript features like generics, conditional types, and utility types.",
    },
];