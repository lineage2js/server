const ai = require('./../../Data/ai');
const EventEmitter = require('events');

class AiManager extends EventEmitter {
  onTalkSelect(aiName, talker) {
    ai.carl.on('showPage', (talker, htmlName) => {
      const fs = require('fs');
      const path = require('path');
      const html = fs.readFileSync(path.resolve(__dirname, `./../../Data/html/${htmlName}`), 'utf16le');

      this.emit('showPage', talker, html);
    });

    ai.carl.on('setMemo', (talker, memo) => {
      this.emit('setMemo', talker, memo);
    });

    ai.carl.onTalkSelected(talker);
  }
}

module.exports = new AiManager();