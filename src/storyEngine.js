const { loadStory } = require('./storyLoader');

class StoryEngine {
  constructor(storySource) {
    if (typeof storySource === 'string') {
      this.story = loadStory(storySource);
    } else {
      this.story = storySource;
    }
    this.roomMap = new Map();
    for (const room of this.story.rooms) {
      this.roomMap.set(room.id, room);
    }
    this.currentRoomId = this.story.rooms[0].id;
  }

  getCurrentScene() {
    return this.roomMap.get(this.currentRoomId);
  }

  submitAction(choiceIndex) {
    const room = this.getCurrentScene();
    if (!room.choices || choiceIndex >= room.choices.length) {
      throw new Error('Invalid choice');
    }
    const targetId = room.choices[choiceIndex].target;
    if (!this.roomMap.has(targetId)) {
      throw new Error('Target room not found');
    }
    this.currentRoomId = targetId;
    return this.getCurrentScene();
  }
}

module.exports = { StoryEngine };
