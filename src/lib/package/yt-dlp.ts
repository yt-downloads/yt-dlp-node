import os from "node:os";
import fs from "node:fs";
import axios from "axios";
import path from "node:path";


// Function to download a file using a URL and save it to a given destination
export async function downloadFile(
    url: string,
    dst: string
): Promise<void> {
    const writer = fs.createWriteStream(dst);

    try {
        const response = await axios.get(url, {
            responseType: "stream",
        });

        // Pipe the response data to the file stream
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    } catch (error: any) {
        throw new Error(`Error downloading file: ${error.message}`);
    };
};


// Interface to define user options for downloading yt-dlp
export interface YTDLPDownloadOptions {
    dst?: string;
    platform?: NodeJS.Platform;
};


// Predefined download URLs for each platform
export const ytDLPDownloadUrls = {
    win32: "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe",
    linux: "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux",
    darwin: "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos",
};


// Default options to use if the user doesn't provide their own
const defaultOptions: YTDLPDownloadOptions = {
    platform: os.platform(),
    dst: path.resolve(process.cwd(), "./bin"),
};


// Function to validate if the platform is supported
const validatePlatform = (platform: string) => {
    return ["win32", "linux", "darwin"].includes(platform);
};


// Main function to download yt-dlp
export async function downloadYTDLP(
    userOptions: YTDLPDownloadOptions = {}
): Promise<void> {
    // Merge default options with user options
    const options: YTDLPDownloadOptions = { ...defaultOptions, ...userOptions };

    // Validate the platform before proceeding
    if (!validatePlatform(options.platform!)) {
        throw new Error(`Unsupported platform: ${options.platform}. Supported platforms are win32, linux, and darwin.`);
    };

    // Ensure the destination directory exists
    if (!fs.existsSync(options.dst!)) {
        fs.mkdirSync(options.dst!, { recursive: true });
    };

    // Get the appropriate download URL based on the platform
    const downloadUrl = ytDLPDownloadUrls[options.platform as keyof typeof ytDLPDownloadUrls];

    // Determine the correct file name for the platform
    const fileName = options.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";
    const executablePath = path.join(options.dst!, fileName);

    // Log the download URL and platform message
    console.log(`[download]: Starting downloading yt-dlp for ${options.platform}.`);
    console.log(`[download]: ${downloadUrl}`);
    
    try {
        await downloadFile(downloadUrl, executablePath);
        console.log(`Destination: ${executablePath}`);
    } catch (error: any) {
        console.log("Error while downloading yt-dlp:", error.message);
        throw error; // Re-throw to allow further handling by the caller if needed
    };
};
