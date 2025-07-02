class Quests {
  constructor() {
    this._quests = [];
  }

  addQuest(questId) {
    const quest = {
      id: questId,
      numberState: 1,
    };

    this._quests.push(quest);
  }

  getQuests() {
    return this._quests;
  }
}

module.exports = Quests;