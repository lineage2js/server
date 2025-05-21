const EventEmitter = require('events');

class TutoKeltir extends EventEmitter {
  onMyDying(talker) {
    const quest = talker.quests.find(quest => quest.id === 201);

    console.log('quest', quest);
  }
}

module.exports = new TutoKeltir();