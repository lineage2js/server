const ServerPacket = require('./ServerPacket.js'); 

class AutoAttackStop {
  constructor(objectId) {
    this._packet = new ServerPacket(5);
    this._packet.writeC(0x3c)
      .writeD(objectId);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AutoAttackStop;