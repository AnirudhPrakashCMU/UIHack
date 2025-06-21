# Task Breakdown

This document enumerates the tasks required to implement the project in a modular fashion. Tasks are grouped by component, with notes on possible concurrency and dependencies.

## 1. Story Engine
1.1 Collect and clean source text adventures (Zork, Hitchhiker's Guide, fan-made stories).


1.2 Design data format for story scripts (e.g., JSON representation of rooms, events, choices).


1.3 Implement parser/loader to ingest these scripts.


1.4 Build core engine to track game state, inventory, and branching logic.


1.5 Expose an API so the interface layer can query current scene and submit player actions.



## 2. Character System
2.1 Research Inworld AI SDK capabilities for dynamic character generation.


2.2 Model characters and NPCs based on story script with attributes (name, personality, role).


2.3 Integrate Inworld AI's dialogue and behaviour system to respond to player input.


2.4 Use Inworld text-to-speech to generate appropriate voices.


2.5 Provide interface hooks for other modules to trigger character dialogue or actions.



## 3. Visual Generation
3.1 Evaluate generative visual APIs (Google Genie, OpenGenie) for local macOS compatibility and choose one that produces real images or animations.


3.2 Build a wrapper module that calls the selected API to generate real images or short animations based on story context.


3.3 Cache generated visuals locally to avoid repeated requests.


3.4 Integrate with the Game Interface to display the generated visuals as scenes change, replacing any placeholders.



## 4. Game Interface
4.1 Choose command-line interface or basic web interface (e.g., Express.js + simple front end).


4.2 Implement input handling for player commands.


4.3 Display narrative text, character speech (using TTS audio output), and generated visuals.


4.4 Persist player progress between sessions.



## 5. Infrastructure & Modularity
5.1 Set up Node.js project structure with independent modules/packages for each subsystem.


5.2 Provide configuration files for local macOS deployment (package.json, environment variables).


5.3 Document APIs so subsystems can be reused independently.



## 6. Real Graphics Integration
6.1 Select and set up a production-ready generative video or animation library (e.g., Stable Diffusion with AnimateDiff, Sora, Google VEO).


6.2 Build a Node.js wrapper that requests animations or high-quality images from the chosen system.


6.3 Replace all placeholder visuals in the interface with the generated results.


6.4 Extend the caching layer to store generated animations locally for reuse.


## 7. Future Enhancements (scoped for later)
- Theming and style customization of visuals.
- Language translation of text using LLMs.
- Home page to select experiences and end-screen summaries.

## 8. Bonus Features
8.1 Keyboard shortcuts for movement (arrow keys).


8.2 Convert PDF books or fanfiction into interactive story files.

8.3 Generate a dynamic map during gameplay that visualizes the player's path.


## Task Scheduling & Parallelism
- Story Engine, Character System, and Visual Generation can be developed in parallel after the initial design phase.
- Game Interface development can start once minimal functionality from the other modules is implemented.
- Frequent integration checkpoints are recommended to ensure modules interoperate correctly.

