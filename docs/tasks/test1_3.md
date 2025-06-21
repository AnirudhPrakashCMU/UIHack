# Test 1.3

## Goal
Verify completion of Task 1.3 by ensuring the story loader can read JSON story files.

## Test Steps
1. Ensure `stories/example_story.json` exists.

2. Run `npm test` to execute Jest tests, including `test/storyLoader.test.js`.

3. Confirm all tests pass without errors.

4. Optionally, call `loadStory` in a Node.js REPL with a custom file to manually verify parsing.

