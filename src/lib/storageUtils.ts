export function extractStoragePathFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const match = urlObj.pathname.match(/\/o\/(.+)/);
        if (match) return decodeURIComponent(match[1]);
        return null;
    } catch {
        return null;
    }
}
