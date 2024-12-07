# YT DLP NODE (NPM Package)

This repository contains an npm package that serves as a Node.js wrapper for [yt-dlp](https://github.com/yt-dlp/yt-dlp). It simplifies the process of downloading videos and audio from various platforms by providing easy-to-use methods and advanced customization options.

## Installation

You can install the package via `npm`. Run the following command:

```bash
npm install git+https://github.com/yt-downloads/yt-dlp-node.git
```

## Features

- Download videos and audio from popular platforms supported by `yt-dlp`.
- Customize download options to suit your needs.
- Seamlessly integrate with Node.js projects.
- TypeScript support for better development experience.

## Documentation

### Download `yt-dlp` Executable

You can automatically download `yt-dlp` for your platform or manually download it if your platform is unsupported.

```ts
import YTDLP from "yt-dlp-node";

import YTDLP from "yt-dlp-node";

// Default download (auto-selects platform)
YTDLP.downloadYTDLP();

// Custom download location
YTDLP.downloadYTDLP({ dst: "./custom-dir" });

// Specify platform (Windows)
YTDLP.downloadYTDLP({ platform: "win32", dst: "./bin" });

// Specify platform (Linux)
YTDLP.downloadYTDLP({ platform: "linux" });
```

**Note:** We only support the following platforms: `win32`, `darwin`, and `linux`. If your platform is not supported, you will need to manually download the `yt-dlp` executable from the [official GitHub release page](https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#release-files).

## Contributing

If you want to contribute to this project, feel free to fork the repository, make changes, and submit a pull request. Please make sure to review the [Contribution Guidelines](CONTRIBUTING.md) before contributing.
