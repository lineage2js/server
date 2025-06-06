const EventEmitter = require('events');
const ai = require('./../../Data/ai');
const npcHtmlMessagesManager = require('./NpcHtmlMessagesManager');
const npcEventBus = require('./../Events/NpcEventBus');

class AiManager extends EventEmitter {
  constructor() {
    super();

    npcEventBus.on('showPage', (talker, htmlFileName) => {
      const htmlMessage = npcHtmlMessagesManager.getHtmlMessageByFileName(htmlFileName)

      this.emit('showPage', talker, htmlMessage);
    });

    npcEventBus.on('setMemo', (talker, memo) => {
      this.emit('setMemo', talker, memo);
    });

    npcEventBus.on('soundEffect', (talker, soundName) => {
      this.emit('soundEffect', talker, soundName);
    });

    npcEventBus.on('giveItem', (talker, itemName) => {
      this.emit('giveItem', talker, itemName);
    });
    
    npcEventBus.on('deleteItem', (talker, itemName, itemCount) => {
      this.emit('deleteItem', talker, itemName, itemCount);
    });

    npcEventBus.on('sell', (talker, sellList, shopName, fnBuy) => {
      this.emit('sell', talker, sellList, shopName, fnBuy);
    });
  }

  onTalkSelect(aiName, talker) {  
    ai.carl.onTalkSelected(talker);
  }

  onMyDying(aiName, talker) { // talker = attacker
    ai.tuto_keltir.onMyDying(talker);
  }

  menuSelect(aiName, talker, ask, reply) {
    ai.lector.onMenuSelected(talker, ask, reply);
  }

  onAttacked(npc, aiName, attacker) {
    if (aiName === 'Elpy') {
      const elpy = new ai.Elpy(npc);

      elpy.onAttacked(attacker);
    }
  }
}

module.exports = new AiManager();