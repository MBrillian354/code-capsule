import React from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import { getSession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function ExploreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (session.isAuth) {
        redirect("/dashboard/explore");
    }
    return <PublicLayout>{children}</PublicLayout>;
}
