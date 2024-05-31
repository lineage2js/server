const ServerPacket = require('./ServerPacket.js'); 

class StopRotating {
  constructor(character, degrees) {
    this._packet = new ServerPacket(17);
    this._packet.writeC(0x78)
      .writeD(character.objectId)
      .writeD(degrees)
      .writeD(2)
      .writeD(0); // ?
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = StopRotating;