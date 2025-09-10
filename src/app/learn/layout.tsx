import React from "react";
import PublicLayout from "@/components/layouts/PublicLayout";

export default async function LearnLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PublicLayout>{children}</PublicLayout>;
}
