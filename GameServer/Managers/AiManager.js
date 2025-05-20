const ai = require('./../../Data/ai');
const EventEmitter = require('events');

class AiManager extends EventEmitter {
  getAiByName(name) {
    if (name === 'carl') {
      ai.carl.on('showPage', (talker, htmlName) => {
        const fs = require('fs');
        const path = require('path');
        const html = fs.readFileSync(path.resolve(__dirname, `./../../Data/html/${htmlName}`), 'utf16le');

        this.emit('showPage', talker, html);
      })

      return ai.carl;
    }
  }
}

module.exports = new AiManager();