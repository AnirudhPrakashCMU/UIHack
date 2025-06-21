const path = require('path');
const OpenAIGame = require('../src/openaiEngine');

describe('OpenAIGame initialization', () => {
  test('passes book text only once', async () => {
    const calls = [];
    const fakeClient = {
      chat: { completions: { create: jest.fn(async (opts) => { calls.push(opts); return { choices: [{ message: { content: 'OK' } }] }; }) } }
    };
    const game = new OpenAIGame(path.join(__dirname, '..', 'stories', 'example_story.json'), fakeClient);
    await game.initPromise;
    // one call for summary and one for initialization
    expect(calls.length).toBeGreaterThanOrEqual(2);
    expect(calls[0].messages[0].content).toContain('Summarize');

    await game.submit('look');
    expect(calls.length).toBeGreaterThanOrEqual(3);
    const last = calls[calls.length - 1];
    expect(last.messages[0].content).toBe(game.baseSystem);
  });

});
