"use server";

export async function createCapsule(
	prevState: string | undefined,
	formData: FormData
) {
	try {
		const url = String(formData.get("url") || "").trim();
		if (!url) return "Please provide a URL.";
		// Call internal API to do the heavy work (fetch, extract, AI, persist)
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/capsule/create`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ url }),
		})
		const data = await res.json()
		if (!res.ok || !data?.ok) {
			return data?.error || 'Failed to create capsule.'
		}
	} catch (err) {
		console.error("[Create capsule] Error:", err);
		return "Failed to create capsule.";
	}

	// Return undefined on success per the project's action conventions.
	return undefined;
}
