import url from "node:url";


// Extracts the video ID from a YouTube URL
export function extractVideoIdFromUrl(videoUrl: string) {
    try {
        const parsedUrl = new url.URL(videoUrl);
        return parsedUrl.searchParams.get("v") || null;
    } catch {
        return null;
    };
};
