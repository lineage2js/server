const ServerPacket = require('./ServerPacket.js'); 

class Die {
  constructor(objectId) {
    this._packet = new ServerPacket(29);
    this._packet.writeC(0x0b)
      .writeD(objectId)
      .writeD(1)
      .writeD(1)
      .writeD(1)
      .writeD(1)
      .writeD(0)
      .writeD(1)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = Die;