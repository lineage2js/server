const fs = require('fs');
const path = require('path');

class NpcHtmlMessagesManager {
  constructor() {
    this._messages = {};
  }

  getHtmlMessageByFileName(fileName) {
    return this._messages[fileName];
  }

  enable() {
    fs.readdir(path.resolve(__dirname, './../../Data/html/npc'), (err, fileNames) => {
      if (err) {
          console.error('Error reading directory:', err);

          return;
      }

      fileNames.forEach(fileName => {
        const filePath = path.join(__dirname, './../../Data/html/npc', fileName);

        fs.readFile(filePath, 'utf8', (err, content) => {
          if (err) {
            console.error('Error reading file:', err);

            return;
          }
              
          this._messages[fileName] = content;
        });
      });
    });
  }
}

module.exports = new NpcHtmlMessagesManager();