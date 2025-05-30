const EventEmitter = require('events');
const ai = require('./../../Data/ai');
const npcHtmlMessagesManager = require('./NpcHtmlMessagesManager');

class AiManager extends EventEmitter {
  onTalkSelect(aiName, talker) {
    ai.carl.once('showPage', (talker, htmlFileName) => { // fix once. Подписатся один раз иди удалить из памяти
      const htmlMessage = npcHtmlMessagesManager.getHtmlMessageByFileName(htmlFileName)

      this.emit('showPage', talker, htmlMessage);
    });

    ai.carl.once('setMemo', (talker, memo) => {
      this.emit('setMemo', talker, memo);
    });

    ai.carl.once('soundEffect', (talker, soundName) => {
      this.emit('soundEffect', talker, soundName);
    });

    ai.carl.once('giveItem', (talker, itemName) => {
      this.emit('giveItem', talker, itemName);
    });

    ai.carl.onTalkSelected(talker);
  }

  onMyDying(aiName, talker) {
    ai.tuto_keltir.once('giveItem', (talker, itemName) => {
      this.emit('giveItem', talker, itemName);
    });

    ai.tuto_keltir.once('soundEffect', (talker, soundName) => {
      this.emit('soundEffect', talker, soundName);
    });

    ai.tuto_keltir.onMyDying(talker);
  }
}

module.exports = new AiManager();