import type { VideoField } from "./lib/metadata/types";
import {
    type YTDLPDownloadOptions,
    downloadYTDLP as _downloadYTDLP
} from "./lib/package/yt-dlp";
import {
    fetchVideoMetadata as _fetchVideoMetadata,
    fetchAvailableVideoQualities as _fetchAvailableVideoQualities,
} from "./lib/metadata";
import { 
    type AudioBitrate,
    downloadAudioFile as _downloadAudioFile,
} from "./lib/download/audio";
import { 
    type VideoQuality,
    downloadVideoFile as _downloadVideoFile,
} from "./lib/download/video";


export default class YTDLP {
    private executablePath: string

    constructor(executablePath: string) {
        this.executablePath = executablePath;
    };


    // Downloads the yt-dlp executable file based on the provided options.
    static downloadYTDLP(
        options: YTDLPDownloadOptions = {}
    ) {
        _downloadYTDLP(options);
    };


    // Fetches video metadata (e.g., id, title, duration) from the provided video URL.
    public async fetchVideoMetadata(options: {
        videoUrl: string;
        select: VideoField[],
    }) {
        return await _fetchVideoMetadata({ ytDlpPath: this.executablePath, ...options });
    };


    // Fetches video qualities (e.g., 1080p, 720p) from the provided video URL.
    public async fetchAvailableVideoQualities(
        videoUrl: string
    ) {
        return await _fetchAvailableVideoQualities({ ytDlpPath: this.executablePath, videoUrl });
    };


    // Downloads an audio file from a given video URL and saves it to the specified destination.
    public async downloadAudioFile(
        userOptions: {
            dst?: string;
            videoUrl: string;
            verbose?: boolean;
            bitrate: AudioBitrate,
        }
    ) {
        const options = { ytDlpPath: this.executablePath, ...userOptions };
        return await _downloadAudioFile(options);
    };


    // Downloads a video file from the specified URL in the desired quality.
    public async downloadVideoFile(
        userOptions: {
            dst?: string;
            videoUrl: string;
            verbose?: boolean;
            quality: VideoQuality;
        }
    ) {
        const options = { ytDlpPath: this.executablePath, ...userOptions };
        return await _downloadVideoFile(options);
    };
};
