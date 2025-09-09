"use server";

export async function createCapsule(
	prevState: string | undefined,
	formData: FormData
) {
	try {
		const url = String(formData.get("url") || "").trim();
		if (!url) return "Please provide a URL.";

		// Placeholder server-side handling. In the future this can call
		// internal DAL functions or other server logic to create the capsule.
		// For now we log the URL similar to the API route.
		console.log("[Create capsule] URL received:", url);
	} catch (err) {
		console.error("[Create capsule] Error:", err);
		return "Failed to create capsule.";
	}

	// Return undefined on success per the project's action conventions.
	return undefined;
}
