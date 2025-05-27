const fs = require('fs');
const path = require('path');

class CommunityBoardManager {
  getHtmlMessageByFileName(fileName) {
    const htmlMessage = this._getFileContentByFileName(fileName);

    return htmlMessage;
  }

  _getFileContentByFileName(fileName) {
    const content = fs.readFileSync(path.resolve(__dirname, `./../../Data/html/community/${fileName}.htm`), 'utf8');

    return content;
  }
}

module.exports = new CommunityBoardManager();