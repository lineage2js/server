const ServerPacket = require('./ServerPacket.js'); 
const config = require('../../config')

class InitLS {
  constructor() {
    this._sessionID = 0x00000000; // fix?
    this._packet = new ServerPacket(9);
    this._packet.writeC(0x00)
      .writeD(this._sessionID)
      .writeD(config.main.SERVER_PROTOCOL_VERSION);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = InitLS;