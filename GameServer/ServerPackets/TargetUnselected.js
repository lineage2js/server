const ServerPacket = require('./ServerPacket'); 

class TargetUnselected {
  constructor(player) {
    this._packet = new ServerPacket(21);
    this._packet.writeC(0x3a)
      .writeD(player.objectId)
      .writeD(player.x)
      .writeD(player.y)
      .writeD(player.z)
      .writeD(player.target);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = TargetUnselected;