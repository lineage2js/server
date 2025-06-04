const npcEventBus = require('./../../GameServer/Events/NpcEventBus');

class DefaultNpc {
  constructor() {
    this.npcEventBus = npcEventBus;
  }

  showPage(talker, htmlFileName) {
    this.npcEventBus.emit('showPage', talker, htmlFileName);
  }

  setMemo(talker, memo) {
    this.npcEventBus.emit('setMemo', talker, memo);
  }

  soundEffect(talker, soundName) {
    this.npcEventBus.emit('soundEffect', talker, soundName);
  }

  giveItem(talker, itemName) {
    this.npcEventBus.emit('giveItem', talker, itemName);
  }

  deleteItem(talker, itemName, itemCount) {
    this.npcEventBus.emit('deleteItem', talker, itemName, itemCount);
  }

  sell(talker, sellList, shopName, fnBuy) {
    this.npcEventBus.emit('sell', talker, sellList, shopName, fnBuy);
  }
}

module.exports = DefaultNpc;