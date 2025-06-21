# Project Specifications

## Vision
Build an agentic AI system that brings imagination to life for games, movies and other stories. The first step is to transform classic text adventures such as *Zork* and *The Hitchhiker's Guide to the Galaxy* into an interactive experience with dynamic visuals and voiced characters.

## Objectives
- Allow players to experience text adventures with a storyline that remains faithful to the source material.
- Use the Inworld AI framework to create in-game characters and NPCs with appropriate voices via Inworld text-to-speech (TTS).
- Generate visuals and game environments dynamically during play using a suitable generative media tool (e.g., Stable Diffusion with AnimateDiff, Sora, or Google VEO).
- Develop everything as modular Node.js components, focused on local macOS deployment.

## Key Features
1. **Story Engine**: Loads original text-based adventure scripts and manages branching narrative logic while preserving the story integrity.
2. **Character System**: Integrates Inworld AI for dialogue, behaviour modelling and TTS voice output for all NPCs and characters.
3. **Visual Generation**: Calls a generative media API to create contextual images or animations for scenes and characters as the story progresses.
4. **Game Interface**: Command-line or lightweight web interface for players to input actions and view the generated outputs (text, images, audio).
5. **Extensibility**: Each subsystem should be independent to allow reuse (story loader, character module, visual generator, interface layer).

6. **Keyboard Shortcuts**: Arrow keys allow movement commands as an alternative to buttons.
7. **PDF Conversion**: Convert fanfiction or books in PDF form into playable story scripts.
8. **Dynamic Map**: The interface draws a small map that traces your path during play.

## Technology Stack
- Node.js (runtime and primary language)
- Inworld AI SDK for NPCs and voice generation
- Generative visual API (Stable Diffusion + AnimateDiff, Sora, or Google VEO)
- Optional simple web framework such as Express.js for the interface
- Local storage (JSON or database) to keep game state and character data

