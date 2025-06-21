# Test 2.5

## Goal
Verify that the CharacterInterface module exposes hooks that other components can use.

## Test Steps
1. Run `npm test` to execute `test/characterInterface.test.js` along with the other Jest suites.


2. Ensure all tests pass. The tests listen for `dialogue` and `action` events emitted by the interface.


3. Optionally create a small script that instantiates `CharacterInterface` and prints the events to confirm manual integration.


4. Review `docs/Stack.md` for any conflicting dependencies. This task does not introduce new packages so no conflicts are expected.


