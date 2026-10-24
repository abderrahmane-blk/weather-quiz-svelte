import { asset } from '$app/paths';

// Fetched in the browser at runtime (never imported at build time),
// so editing static/content.json and redeploying is enough.
// asset() adds the base path, e.g. /REPO-NAME/content.json on GitHub Pages.
export async function loadContent() {
	const response = await fetch(asset('content.json'), { cache: 'no-store' });
	if (!response.ok) {
		throw new Error(`Could not load content.json (HTTP ${response.status})`);
	}
	return response.json();
}