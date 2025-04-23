const ServerPacket = require('./ServerPacket.js'); 

class ChangeMoveType {
  constructor(objectId, moveType) {
    this._packet = new ServerPacket(9);
    this._packet.writeC(0x3e)
      .writeD(objectId)
      .writeD(moveType);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ChangeMoveType;