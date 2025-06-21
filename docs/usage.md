# Usage Guide

This guide explains how to set up and run the project on a macOS system.

## Prerequisites
- Install [Node.js](https://nodejs.org/) v20 (LTS).
- Install Git.
- Install the `frotz` package. `make install` will try to install it
  automatically via Homebrew or `apt-get` if missing. You can also
  install it manually with `brew install frotz` on macOS.
  The Makefile automatically runs `dfrotz` when available and falls back to
  `frotz`. This allows running under root (using `dfrotz`) while also working on
  macOS where only `frotz` is installed.

## Setup
```bash
# clone the repository
git clone <repo-url>
cd GameHacks

# install Node dependencies and provide API keys if missing
make install

# fetch sample games
make fetch
```

## Running Tests
Run all automated tests:
```bash
make test
```

To debug image generation you can run:
```bash
make test-image
```
This reads the most recent prompt saved in `impprompt.txt` (generated during
gameplay) and sends it to the image API. Set `VISUAL_API_KEY` in `.env`.

## Launching a Game
After fetching games you can launch Zork in the terminal:
```bash
make play-zork
```
Use standard text adventure commands to play. Press `Ctrl+C` to exit.

## Starting the Web GUI
Launch the built-in Express server and open your browser to `http://localhost:3000`:
```bash
npm start
```
The start script runs `scripts/setup_keys.js` first. It checks `.env` and prompts for any missing keys: `OPENAI_API_KEY`, `INWORLD_API_KEY`, and `VISUAL_API_KEY` used for image generation. `VISUAL_API_KEY` should be your OpenAI key with DALL‑E access. The server uses the **gpt-4.1-nano** model for faster responses. If the `GAME` environment variable is set, that story loads automatically; otherwise the page waits for you to choose a game. The story text is summarized once at startup so visuals have concise context. After initialization, only the conversation log and player commands are sent. The AI narrates the adventure without presenting explicit options or any markdown formatting, including bold text. Image requests specify `model: dall-e-3` and `size: 1024x1024`.
When you open the page a title screen appears with buttons for **Zork**, **Hitchhiker's Guide**, or **Star Wars**. Selecting a game loads the adventure in the browser with text, images and a small map. A **Home** button returns to the title screen at any time and an **End** button shows a final screen with a restart option. Zork is still available in the terminal using `make play-zork`.
OpenAI generates the entire narrative directly, including character dialogue. The server sends each response to Inworld's TTS API so the text is read aloud. Status codes from the TTS API are logged.
At startup the server fetches the list of available Inworld voices using axios and prints them to the console. When dialogue lines are detected ("Character: line"), the name before the colon selects the voice for synthesis.
Movement works with the arrow keys. A canvas in the bottom right corner records your path as you travel through the game world. While a new scene is loading, a **Loading...** overlay flashes on the screen until the image is ready.
Each time a scene loads the server generates a visual via `ensureVisual()`. The image prompt includes a brief book summary, current characters and recent log entries. Every request body is appended to `impprompt.txt` for debugging. If no graphics generator is configured the built-in base64 placeholder is used. Task 6 shows how to replace this with real images or animations produced by tools such as AnimateDiff, Sora or Google VEO.
See [graphics.md](graphics.md) for a complete explanation of the graphics pipeline and debug messages.

If you provided an Inworld API key, the character system will call the
Inworld TTS API when a scene defines a `character` field. The resulting audio is
played in the browser alongside the scene description.
Debug messages are minimal. Image prompts are stored in `impprompt.txt`. The context window and cache are cleared whenever `npm start` runs so each session begins fresh.

## Updating Dependencies
If new packages are added, run `make install` again. Update `docs/Stack.md` with exact version numbers to keep track of the software stack.

## Converting PDFs to Games
Run the conversion script to transform a PDF book into a JSON story file:

```bash
node scripts/convert_pdf.js path/to/book.pdf stories/book.json
```

The repository includes base64 versions of *The Hunger Games* and a short *Star Wars* fan story. You can generate a game file from a PDF with:

```bash
npm run generate-hunger
```

Then load the resulting JSON with the Story Engine or the web interface. Large PDFs such as *The Hunger Games* may take several seconds to process.
