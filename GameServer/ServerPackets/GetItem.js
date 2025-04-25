const ServerPacket = require('./ServerPacket.js'); 

class GetItem {
  constructor(character, item) {
    this._packet = new ServerPacket(21);
    this._packet.writeC(0x17)
      .writeD(character.objectId)
      .writeD(item.objectId)
      .writeD(item.x)
      .writeD(item.y)
      .writeD(item.z);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = GetItem;