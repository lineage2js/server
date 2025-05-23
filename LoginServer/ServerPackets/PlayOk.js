const ServerPacket = require('./ServerPacket.js'); 

class PlayOk {
  constructor(sessionKey2) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x07)
      .writeD(sessionKey2[0])
      .writeD(sessionKey2[1]);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = PlayOk;