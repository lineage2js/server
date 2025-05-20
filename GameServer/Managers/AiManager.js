const ai = require('./../../Data/ai');
const EventEmitter = require('events');

class AiManager extends EventEmitter {
  onTalkSelect(aiName, talker) {
    ai.carl.once('showPage', (talker, htmlName) => { // fix once. Подписатся один раз иди удалить из памяти
      const fs = require('fs');
      const path = require('path');
      const html = fs.readFileSync(path.resolve(__dirname, `./../../Data/html/${htmlName}`), 'utf16le');

      this.emit('showPage', talker, html);
    });

    ai.carl.once('setMemo', (talker, memo) => {
      this.emit('setMemo', talker, memo);
    });

    ai.carl.once('soundEffect', (talker, soundName) => {
      this.emit('soundEffect', talker, soundName);
    });

    ai.carl.onTalkSelected(talker);
  }
}

module.exports = new AiManager();