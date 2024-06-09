const ServerPacket = require('./ServerPacket.js'); 

class DeleteObject {
  constructor(objectId) {
    this._packet = new ServerPacket(5);
    this._packet.writeC(0x1e)
      .writeD(objectId);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = DeleteObject;