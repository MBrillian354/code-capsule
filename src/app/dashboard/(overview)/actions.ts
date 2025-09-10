"use server";

import { redirect } from "next/navigation";

export async function createCapsule(
	prevState: string | undefined,
	formData: FormData
) {
	const url = String(formData.get("url") || "").trim();
	if (!url) return "Please provide a URL.";
	
	// Redirect to progress page with URL as search param
	redirect(`/dashboard/capsule/create?url=${encodeURIComponent(url)}`);
}
