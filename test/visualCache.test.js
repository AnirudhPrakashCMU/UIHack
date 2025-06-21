const fs = require('fs');
const path = require('path');
const VisualCache = require('../src/visualCache');

const tmpDir = path.join(__dirname, 'tmp_cache');

afterEach(() => {
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('generates and caches visuals', async () => {
  const cache = new VisualCache(tmpDir);
  const generator = jest.fn(async (key) => Buffer.from(`img-${key}`));

  const firstPath = await cache.getVisual('scene1', generator);
  expect(fs.existsSync(firstPath)).toBe(true);
  expect(generator).toHaveBeenCalledTimes(1);

  const secondPath = await cache.getVisual('scene1', generator);
  expect(secondPath).toBe(firstPath);
  expect(generator).toHaveBeenCalledTimes(1);
});
