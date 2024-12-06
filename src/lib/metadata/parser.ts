import type { VideoField, VideoMetadata } from "./types";


export function buildFieldString(
    fields: VideoField[]
) {
    // Use a Set to ensure uniqueness of the selected fields
    const uniqueFields = new Set(fields);

    // Transform and return the formatted field names
    const formattedFields = Array.from(uniqueFields).map((field) => {
        // Special handling for the 'url' field
        if (field === "url") {
            return "original_url";
        };

        return field;
    });

    // Join fields into a comma-separated string for the yt-dlp command (id,title)
    return formattedFields.join(",");
};


export function parseMetadata<T>(
    rawOutput: string,
    fields: VideoField[],
) {
    // Clean and split the raw output into lines
    const outputLines = rawOutput.split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    // Initialize metadata object of type T
    const metadata: Partial<VideoMetadata> = {};
    
    fields.forEach((key: VideoField, index) => {
        // Ensure no out-of-bounds access
        const value = outputLines[index] || "";

        if (key === "duration" && typeof value === "string") {
            metadata[key] = Number.parseInt(value);
        } else if (
            key === "id" ||
            key === "url" ||
            key === "title" ||
            key === "duration_string"
        ) {
            metadata[key] = value;
        };
    });

    return metadata as T;
};


export function parseVideoQualities(
    rawOutput: string,
) {
    // Using Set to avoid duplicates
    const videoQualities: Set<string> = new Set();

    // Split the output into lines
    const lines = rawOutput.split("\n");

    // Parse the lines to identify available formats
    lines.forEach(line => {
        const formatParts = line.split(/\s+/); // Split by whitespace
        if (formatParts.length > 2) {
            const description = formatParts.slice(1).join(" "); // Full description

            // Check for video Qualities
            if (description.includes("video")) {
                // Match "720p", "1080p", etc.
                const resolutionMatch = description.match(/\d+p/); 

                if (resolutionMatch) {
                    videoQualities.add(resolutionMatch[0]);
                };
            };
        };
    });

    return Array.from(videoQualities);
};
