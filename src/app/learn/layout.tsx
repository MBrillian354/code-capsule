import React from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import { getSession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function LearnLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (session.isAuth) {
        // If user is authenticated, redirect from dashboard/learn/[id] to /dashboard/capsule/[id]/learn
    }
    return <PublicLayout>{children}</PublicLayout>;
}
