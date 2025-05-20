const ai = require('./../../Data/ai');
const EventEmitter = require('events');

class AiManager extends EventEmitter {
  executeCommand(command, aiName, talker) {
    if (command === 'talk_select') {
      ai.carl.on('showPage', (talker, htmlName) => {
        const fs = require('fs');
        const path = require('path');
        const html = fs.readFileSync(path.resolve(__dirname, `./../../Data/html/${htmlName}`), 'utf16le');

        this.emit('showPage', talker, html);
      })

      ai.carl.onTalkSelected(talker);
    }
  }
}

module.exports = new AiManager();