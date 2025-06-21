const path = require('path');
const { loadStory } = require('../src/storyLoader');

describe('storyLoader', () => {
  test('loads a story JSON file', () => {
    const storyPath = path.join(__dirname, '..', 'stories', 'example_story.json');
    const story = loadStory(storyPath);
    expect(story.title).toBe('Example Adventure');
    expect(Array.isArray(story.rooms)).toBe(true);
    expect(story.rooms[0].id).toBe('start');
  });
});
