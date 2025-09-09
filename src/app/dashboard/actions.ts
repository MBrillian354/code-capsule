"use server";

import { createCapsuleFromUrl } from "@/lib/capsules";

export async function createCapsule(
	prevState: string | undefined,
	formData: FormData
) {
	try {
		const url = String(formData.get("url") || "").trim();
		if (!url) return "Please provide a URL.";
		// Call the lib directly so request cookies are available to getSession()
		const result = await createCapsuleFromUrl(url);
		if (!result.ok) {
			return result.error || "Failed to create capsule.";
		}
	} catch (err) {
		console.error("[Create capsule] Error:", err);
		return "Failed to create capsule.";
	}

	// Return undefined on success per the project's action conventions.
	return undefined;
}
