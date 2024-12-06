// define interface for storing metadata about a video.
export interface VideoMetadata {
    id: string;
    url: string;
    title: string;
    duration: number;        // Duration in seconds
    duration_string: string; // Duration as a formatted string (e.g., "4:30")
};

// define type for represents the keys of the VideoMetadata interface.
export type VideoField = 
    keyof VideoMetadata;
