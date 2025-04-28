const ServerPacket = require('./ServerPacket.js'); 

class AutoAttackStart {
  constructor(objectId) {
    this._packet = new ServerPacket(5);
    this._packet.writeC(0x3b)
      .writeD(objectId);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AutoAttackStart;