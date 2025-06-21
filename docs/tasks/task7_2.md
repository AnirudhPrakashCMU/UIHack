# Task 7.2

## Description
Provide a pipeline to convert PDF books or fanfiction into structured text adventure scripts.

## Implementation Steps
1. Evaluate existing PDF-to-text and interactive fiction tools (e.g., pdf.js, NLP libraries, Twine or Ink converters).

2. Design a process that extracts text from PDF, segments it into scenes, and maps choices or branching based on narrative cues.

3. Implement a Node.js script or leverage an open-source repository to perform the conversion.
   - The current implementation uses the `pdf-parse` package to extract text.
   - `scripts/generate_hunger_game.js` decodes `books/hunger_games.pdf.base64` and produces `stories/hunger_games.json`.
4. Store the resulting script in the same JSON format used by the Story Engine.
5. Note: Look for existing code if possible.

