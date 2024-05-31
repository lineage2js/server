const ServerPacket = require('./ServerPacket.js'); 

class Attack {
  constructor(player, targetObjectId) {
    this._packet = new ServerPacket(23);
    this._packet.writeC(0x06)
      .writeD(player.objectId)
      .writeD(targetObjectId)
      .writeD(1) // damage

      .writeC(0) // hit
      .writeD(player.x)
      .writeD(player.y)
      .writeD(player.z)
      .writeH(0);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = Attack;