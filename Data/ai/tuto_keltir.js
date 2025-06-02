const DefaultNpc = require('./DefaultNpc');

class TutoKeltir extends DefaultNpc {
  onMyDying(talker) {
    const quest = talker.quests.find(quest => quest.id === 201);

    if (quest) {
      this.giveItem(talker, 'fox_fang1', 1);
      this.soundEffect(talker, 'ItemSound.quest_itemget');
    }
  }
}

module.exports = new TutoKeltir();