const ServerPacket = require('./ServerPacket.js'); 

class PlayOk {
  constructor(SessionKey2) {
    this._packet = new ServerPacket(12);
    this._packet.writeC(0x07)
      .writeD(SessionKey2[0])
      .writeD(SessionKey2[1]);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = PlayOk;