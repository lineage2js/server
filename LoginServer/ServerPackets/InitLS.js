const ServerPacket = require('./ServerPacket.js'); 
const config = require('../../config')

class InitLS {
  constructor(sessionID) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x00)
      .writeD(sessionID)
      .writeD(config.main.SERVER_PROTOCOL_VERSION);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = InitLS;