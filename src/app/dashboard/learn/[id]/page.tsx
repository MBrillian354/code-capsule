import { userCapsuleContentSamples } from "@/app/dashboard/placeholder-data";
import { notFound } from "next/navigation";
import ReaderClient from "./ReaderClient";

export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id } = await props.params;

    const capsule = userCapsuleContentSamples.find((c) => c.id === id);
    if (!capsule) {
        // Let Next.js handle not found route UI
        notFound();
    }

    // Pass to client component. Query state managed client-side via useSearchParams.
    return <ReaderClient capsule={capsule} />;
}
