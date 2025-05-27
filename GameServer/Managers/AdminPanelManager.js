const fs = require('fs');
const path = require('path');

class AdminPanelManager {
  getHtmlMessageByFileName(fileName) {
    const htmlMessage = this._getFileContentByFileName(fileName);

    return htmlMessage;
  }

  _getFileContentByFileName(fileName) {
    const content = fs.readFileSync(path.resolve(__dirname, `./../../Data/html/admin/${fileName}.htm`), 'utf8');

    return content;
  }
}

module.exports = new AdminPanelManager();