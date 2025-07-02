const ServerPacket = require('./ServerPacket.js'); 

class ShowRadar {
  constructor(player) {
    this._packet = new ServerPacket();
    this._packet.writeC(0xBD)
      .writeD(player.x)
      .writeD(player.y)
      .writeD(player.z)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ShowRadar;