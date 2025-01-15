const ServerPacket = require('./ServerPacket.js'); 

class StopMove {
  constructor(objectId, x, y, z) {
    this._packet = new ServerPacket(21);
    this._packet.writeC(0x59)
      .writeD(objectId)
      .writeD(x)
      .writeD(y)
      .writeD(z)
      .writeD(0);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = StopMove;