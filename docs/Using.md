# Using Open Source Resources

This project relies on several open source repositories and tools to collect games and run them.

## External Repositories and Tools
- [historicalsource/zork1](https://github.com/historicalsource/zork1) – source for the original Zork I game files.
- [historicalsource/hitchhikersguide](https://github.com/historicalsource/hitchhikersguide) – source for the Hitchhiker's Guide to the Galaxy game files.
- [Frotz](https://github.com/DavidGriffith/frotz) – command-line interpreter used to run Z-machine games. `make install` attempts to install it via Homebrew or `apt-get`.
- [VibeZork](https://github.com/mlemos/vibezork) – demonstration project fetching Zork and wiring open-source tools.
- [Inworld Node.js SDK](https://github.com/inworld-ai/inworld-nodejs-sdk) – official client library for character dialogue and TTS.
- [OpenAI Node.js SDK](https://github.com/openai/openai-node) – used to generate text responses for gameplay.
- [OpenGenie](https://github.com/opengenie/open-genie) – example generative visual framework.
- [AnimateDiff](https://github.com/guoyww/AnimateDiff) – open source animation extension for Stable Diffusion.
- [Sora](https://github.com/openai/sora) or [Google VEO](https://github.com/google/veo) – advanced generative video systems if accessible.
- [Express](https://expressjs.com/) – minimal web framework used for the GUI.
- [Mousetrap](https://github.com/ccampbell/mousetrap) – captures keyboard shortcuts in the browser.
- [pdf-parse](https://github.com/modesty/pdf-parse) – Node.js library for extracting text from PDFs.
- [axios](https://github.com/axios/axios) – promise-based HTTP client used for Inworld API requests.

Early versions used a base64 placeholder image. Task 6 introduces real graphics
by calling tools such as AnimateDiff or Sora through a Node.js wrapper.

## Supported Games
- **Zork I** (`game_data/zork1.z3`)
- **Hitchhiker's Guide to the Galaxy** (`game_data/hitchhikersguide.z3`)
- **Star Wars Fan Story** (`stories/star_wars.json`)
- **Example Adventure** (`stories/example_story.json`) used for StoryEngine tests

Update this file as new game sources or external libraries are incorporated.
