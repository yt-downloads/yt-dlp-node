import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import { promisify } from "node:util";
import { exec } from "node:child_process";

import { extractVideoId } from "../utils";


// Promisify exec for async/await
const execPromise = promisify(exec);


// Available Audio Qualities
export type AudioBitrate = "48k" | "128k" | "192k"  | "256k" | "320k";


// Converts a `.webm` audio/video file to `.mp3` format with a specified audio bitrate.
async function convertWebmToMp3(options: {
    src: string;
    dst: string;
    bitrate: number,
}) {
    // Use ffmpeg to convert the webm file to mp3 with the specified bitrate
    const output = await ffmpeg(options.src)
        .output(options.dst)
        .audioBitrate(options.bitrate)
        .run()
    
    // @ts-ignore
    return output._outputs[0].target;
};


export async function downloadAudioFile(
    userOptions: {
        dst?: string;
        videoUrl: string;
        verbose?: boolean;
        ytDlpPath: string;
        bitrate: AudioBitrate;
    }
) {
    const options = {
        verbose: true,
        dst: path.join(process.cwd(), "download"), // Default destination if not specified
        ...userOptions,
    };

    try {
        // Extract the video ID
        const videoId = extractVideoId(options.videoUrl);
        if (!videoId) {
            throw new Error("Invalid YouTube URL: Unable to extract video ID.");
        };

        // Determine output file name
        let outputFilePath: string;
        const isDirectory = !path.extname(options.dst); // Check if dst is a directory
        if (isDirectory) {
            outputFilePath = path.join(options.dst, `${videoId}.mp3`);
        } else {
            outputFilePath = options.dst;
        };

        // Verbose logging for download start
        if (options.verbose) {
            console.log("[download]: Starting download...");
            console.log(`[download]: Video URL - ${options.videoUrl}`);
        };

        // Generate a timestamp-based file basename to avoid conflicts
        const basename = videoId;

        // Construct the yt-dlp command to download the best audio format
        const command = `${options.ytDlpPath} -f "bestaudio" -o "${path.join(options.dst, `${basename}.%(ext)s`)}" "${options.videoUrl}"`;

        // Execute the download command
        const { stderr } = await execPromise(command);

        // Handle errors during the download
        if (stderr) {
            throw new Error(stderr);
        };

        // Assume the file is downloaded as webm (the best audio format
        const webmFilePath = path.join(options.dst, `${basename}.webm`);

        // Convert bitrate into number (remove 'k' suffix)
        const audioBitrate = Number.parseInt(options.bitrate.replace("k", ""));

        // Verbose logging for conversion process
        if (options.verbose) {
            console.log(`[download]: Converting ${webmFilePath} to mp3 with bitrate ${options.bitrate}`);
        };

        // Convert the downloaded webm file to mp3
        const mp3FilePath = await convertWebmToMp3({
            src: webmFilePath,
            dst: outputFilePath,
            bitrate: audioBitrate,
        });

        // Verbose logging for successful conversion
        if (options.verbose) {
            console.log(`[download]: Conversion successful! MP3 saved to ${mp3FilePath}`);
        };

        return mp3FilePath;
    } catch (error) {
        throw error;
    };
};
