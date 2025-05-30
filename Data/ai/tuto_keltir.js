const EventEmitter = require('events');

class TutoKeltir extends EventEmitter {
  onMyDying(talker) {
    const quest = talker.quests.find(quest => quest.id === 201);

    if (quest) {
      this.emit('giveItem', talker, 'fox_fang1', 1);
      this.emit('soundEffect', talker, "ItemSound.quest_itemget");
    }
  }
}

module.exports = new TutoKeltir();