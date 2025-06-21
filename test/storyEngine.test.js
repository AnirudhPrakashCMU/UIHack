const path = require('path');
const { StoryEngine } = require('../src/storyEngine');

describe('StoryEngine', () => {
  test('loads story and transitions between rooms', () => {
    const storyPath = path.join(__dirname, '..', 'stories', 'example_story.json');
    const engine = new StoryEngine(storyPath);
    expect(engine.getCurrentScene().id).toBe('start');
    engine.submitAction(0);
    expect(engine.getCurrentScene().id).toBe('north_room');
  });

  test('throws on invalid choice', () => {
    const storyPath = path.join(__dirname, '..', 'stories', 'example_story.json');
    const engine = new StoryEngine(storyPath);
    expect(() => engine.submitAction(5)).toThrow('Invalid choice');
  });
});
