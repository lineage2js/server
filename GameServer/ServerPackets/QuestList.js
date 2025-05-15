const ServerPacket = require('./ServerPacket.js'); 

class QuestList {
  constructor() {
    this._packet = new ServerPacket(10);
    this._packet.writeC(0x98)
      .writeH(1)
      .writeD(201)
      .writeD(1);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = QuestList;