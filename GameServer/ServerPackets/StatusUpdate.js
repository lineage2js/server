const ServerPacket = require('./ServerPacket.js'); 

class StatusUpdate {
  constructor(objectId, hp, maxHp) { // fix
    this._packet = new ServerPacket(17);
    this._packet.writeC(0x1a)
      .writeD(objectId)
      .writeD(2)
      .writeD(0x09)
      .writeD(hp)
      .writeD(0x0a)
      .writeD(maxHp)
      
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = StatusUpdate;