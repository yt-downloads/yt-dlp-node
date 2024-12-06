import {
    type YTDLPDownloadOptions,
    downloadYTDLP as _downloadYTDLP
} from "./lib/package/yt-dlp";


export default class YTDLP {
    // Downloads the yt-dlp executable file based on the provided options.
    static downloadYTDLP(
        options: YTDLPDownloadOptions = {}
    ) {
        _downloadYTDLP(options);
    };
};
