import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import { promisify } from "node:util";
import { exec } from "node:child_process";

import { extractVideoIdFromUrl } from "../utils";


// Promisify exec to use async/await syntax
const execPromise = promisify(exec);


// Available Video Quality
export type VideoQuality = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p";


// Available options of video quality
export const VIDEO_QUALITY_OPTIONS: VideoQuality[] = ["144p", "240p", "360p", "480p", "720p", "1080p", "1440p", "2160p"];


// Converts a `.webm` audio/video file to `.mp4` file.
async function convertWebmToMp4(
    options: {
        src: string;
        dst: string
    }
) {
    ffmpeg(options.src)
        .output(options.dst)
        .videoCodec("libx264") // Use H.264 codec for better compatibility
        .audioCodec("aac")     // Use AAC codec for audio
        .run();
};


// Downloads a video from YouTube in the specified quality.
export async function downloadVideoFile(
    userOptions: {
        dst?: string;
        verbose?: boolean;
        videoUrl: string;
        ytDlpPath: string;
        quality: VideoQuality;
    }
) {
    const options = {
        verbose: true,
        dst: path.join(process.cwd(), "download"), // Default destination if not specified
        ...userOptions,
    };

    try {
        // Extract the video ID
        const videoId = extractVideoIdFromUrl(options.videoUrl);
        if (!videoId) {
            throw new Error("Invalid YouTube URL: Unable to extract video ID.");
        };

        // Determine output directory and file paths
        const isDirectory = !path.extname(options.dst); // Check if dst is a directory
        const outputDirectory = isDirectory ? options.dst : path.dirname(options.dst);

        // Construct the output/input file path
        const webmFilePath = path.join(outputDirectory, `${videoId}.webm`);
        const mp4FilePath = isDirectory ? path.join(outputDirectory, `${videoId}.mp4`) : options.dst;

        // Verbose logging for download start
        if (options.verbose) {
            console.log("[download]: Starting download...");
            console.log(`[download]: Video URL - ${options.videoUrl}`);
        };

        // Extract the height from the selected quality (e.g., "480p" -> 480)
        const height = options.quality.split("p")[0];

        // Construct the yt-dlp command to download the video
        const command = `${options.ytDlpPath} -f "bestaudio[ext=webm]+bestvideo[height=${height}][ext=webm]/best[height=${height}][ext=webm]" -o "${webmFilePath}" "${options.videoUrl}"`;

        // Execute the command to download the video
        const { stderr } = await execPromise(command);

        // Check if there are errors in stderr
        if (stderr) {
            throw new Error(stderr);
        };

        // Convert the downloaded `.webm` file to `.mp4`
        if (options.verbose) {
            console.log(`[download]: Converting ${webmFilePath} to ${mp4FilePath}`);
        };

        // Convert to mp4
        await convertWebmToMp4({ src: webmFilePath, dst: mp4FilePath });

        // Verbose logging for successful conversion
        if (options.verbose) {
            console.log(`[download]: Conversion successful! MP4 saved to ${mp4FilePath}`);
        };

        return mp4FilePath;
    } catch (error) {
        throw error;
    };
};
