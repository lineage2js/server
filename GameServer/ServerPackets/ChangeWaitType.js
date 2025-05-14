const ServerPacket = require('./ServerPacket.js'); 

class ChangeWaitType {
  constructor(character) {
    this._packet = new ServerPacket(21);
    this._packet.writeC(0x3f)
      .writeD(character.objectId)
      .writeD(0)
      .writeD(character.x)
      .writeD(character.y)
      .writeD(character.z);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ChangeWaitType;