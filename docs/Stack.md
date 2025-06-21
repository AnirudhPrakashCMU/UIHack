# Software Stack

This document tracks the frameworks and dependencies in use. Versions should be regularly checked to avoid conflicts.

## Runtime
- Node.js (LTS)


## Frameworks and SDKs
- Inworld Node.js SDK 1.17.0
- OpenAI Node.js SDK 4.25.0 (default model **gpt-4.1-nano**)
- dotenv 16.5.0 for loading API keys from `.env`
- `VISUAL_API_KEY` environment variable used by the OpenAI image generator (optional)

- Generative visual API (OpenAI Image API with `model: dall-e-3` and 1024x1024 images by default; other options like Stable Diffusion, Sora or Google VEO can be integrated)

- Express.js 4.18.2 (web interface)
- Mousetrap 1.6.x (keyboard shortcuts)
- pdf-parse 1.1.1 (PDF to text conversion)
- pdfkit 0.17.1 (used for generating sample PDFs during tests)
- axios 1.10.0 for Inworld API requests
- HTML5 Canvas API (browser-based dynamic map drawing)
- Book summaries generated via OpenAI chat completion (gpt-4.1-nano)


## Utilities
- Jest for testing

- Frotz 2.54 (command-line Z-machine interpreter, provides `frotz` and `dfrotz`)
  - The Makefile tries to run `dfrotz` first and falls back to `frotz`.
  - `make install` attempts to install Frotz via Homebrew or `apt-get` if it is
    missing. This lets the game run under root environments as well as typical
    macOS setups.
- Node.js `events` module used by CharacterInterface

- Node.js `fs` and `path` modules used by VisualCache
- Node.js `fs` and `path` modules used by bookUtils to derive book summaries and character lists
- Node.js `child_process` module used to run Frotz for Zork gameplay


When integrating new packages, update this list with exact versions used in `package.json` to ensure compatibility.

## Current Versions
- Node.js 20.19.2

- jest 30.0.0


No conflicts detected as of this commit.
