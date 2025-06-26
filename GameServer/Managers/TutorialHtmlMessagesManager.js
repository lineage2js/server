const fs = require('fs');
const path = require('path');

class TutorialHtmlMessagesManager {
  getHtmlMessageByFileName(fileName) {
    const htmlMessage = this._getFileContentByFileName(fileName);

    return htmlMessage;
  }

  _getFileContentByFileName(fileName) {
    const content = fs.readFileSync(path.resolve(__dirname, `./../../Data/html/tutorial/${fileName}.htm`), 'utf8');

    return content;
  }
}

module.exports = new TutorialHtmlMessagesManager();