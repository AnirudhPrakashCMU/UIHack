const EventEmitter = require('events');

/**
 * CharacterInterface acts as a thin wrapper around the Inworld SDK.
 * It exposes methods that other modules can call to trigger
 * character dialogue or actions. For testing, it simply emits events.
 */
class CharacterInterface extends EventEmitter {
  constructor() {
    super();
  }

  /**
   * Trigger a piece of dialogue from a character.
   * In a real implementation this would call the Inworld API.
   * @param {string} characterId
   * @param {string} text
   */
  triggerDialogue(characterId, text) {
    const payload = { characterId, text };
    this.emit('dialogue', payload);
    return payload;
  }

  /**
   * Trigger a character action.
   * @param {string} characterId
   * @param {string} action
   */
  triggerAction(characterId, action) {
    const payload = { characterId, action };
    this.emit('action', payload);
    return payload;
  }
}

module.exports = { CharacterInterface };
