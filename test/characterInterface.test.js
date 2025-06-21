const { CharacterInterface } = require('../src/characterInterface');

describe('CharacterInterface', () => {
  test('emits dialogue events', done => {
    const ci = new CharacterInterface();
    const expected = { characterId: 'npc1', text: 'hello' };
    ci.on('dialogue', payload => {
      expect(payload).toEqual(expected);
      done();
    });
    ci.triggerDialogue('npc1', 'hello');
  });

  test('emits action events', done => {
    const ci = new CharacterInterface();
    const expected = { characterId: 'npc1', action: 'wave' };
    ci.on('action', payload => {
      expect(payload).toEqual(expected);
      done();
    });
    ci.triggerAction('npc1', 'wave');
  });
});
