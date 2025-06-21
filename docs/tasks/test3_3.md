# Test 3.3

## Goal
Verify completion of Task 3.3 (caching generated visuals).

## Test Steps
1. Run the unit test:

   ```bash
   npx jest test/visualCache.test.js --runInBand
   ```
2. Manually trigger the cache module in a sample script and confirm that a visual is only generated once when requested repeatedly.

3. Inspect the `cache/` directory to ensure files are stored correctly and reused.

4. Check for any errors or exceptions in the logs.


## Notes on Dependencies
- This task relies only on Node.js built-in modules (`fs`, `path`). No additional packages are required, so it does not conflict with the current stack.
