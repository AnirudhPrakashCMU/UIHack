# Test 1.1

## Goal
Verify completion of Task 1.1.

## Test Steps
1. Run `make install` to install Node dependencies and ensure `frotz` is
   available (the Makefile attempts to install it via Homebrew or `apt-get`).
   The script prompts for any missing API keys (`OPENAI_API_KEY`, `INWORLD_API_KEY`, `VISUAL_API_KEY`) without deleting your existing `.env` file.
2. Run `npm run fetch-games` to download the Zork and Hitchhiker's Guide sources.
3. Execute `npm test` to run automated Jest tests (`test/fetch_games.test.js`).

4. Confirm that `game_data/zork1.z3` and `game_data/hitchhikersguide.z3` exist.

5. Review console output for any errors or exceptions.

6. Clean up the temporary directories after tests complete.

7. Optionally run `make play-zork` (or manually invoke `dfrotz`/`frotz` depending on your environment) to ensure the game launches correctly.

