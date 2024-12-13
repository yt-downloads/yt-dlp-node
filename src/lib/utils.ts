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


// Generates a YouTube video URL from a video ID
export function generateYouTubeUrl(videoId: string) {
    return `https://www.youtube.com/watch?v=${videoId}`;
};
