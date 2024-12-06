import { promisify } from "node:util";
import { exec } from "node:child_process";

import type { VideoField } from "./types";
import {
    parseMetadata,
    buildFieldString,
    parseVideoQualities,
} from "./parser";


// Promisify exec to use async/await syntax
const execPromise = promisify(exec);


export async function fetchVideoMetadata<T>(
    options: {
        videoUrl: string;
        ytDlpPath: string;
        select: VideoField[];
    }
) {
    try {
        // Format the selected fields into a comma-separated string
        const stringFields = buildFieldString(options.select);

        // Build the yt-dlp command to fetch metadata for the selected fields
        const command = `${options.ytDlpPath} --print ${stringFields} --skip-download "${options.videoUrl}"`;

        // Execute the command to fetch metadata
        const { stdout } = await execPromise(command);

        // Parse and return the metadata
        return parseMetadata<T>(stdout, options.select);
    } catch (error) {
        console.error("Error fetching video metadata:", error);
        throw new Error("Failed to fetch video metadata");  
    };
};


export async function fetchAvailableVideoQualities(
    options: {
        videoUrl: string;
        ytDlpPath: string;
    }
) {
    try {
        // yt-dlp command to fetch available formats
        const command = `${options.ytDlpPath} -F --skip-download "${options.videoUrl}"`;

        // Execute the command
        const { stdout } = await execPromise(command);

        // Parse raw output to ["1080p", "720p",...]
        return parseVideoQualities(stdout);
    } catch (error) {
        console.error("Error fetching video resolutions:", error);
        throw new Error("Failed to fetch available video/audio qualities");
    };
};
