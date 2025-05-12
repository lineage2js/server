const ServerPacket = require('./ServerPacket.js');

class ServerList {
  constructor(gameservers, playersOnline) {
    this._packet = new ServerPacket(1 + 3 + (gameservers.length * (20)));
    this._packet.writeC(0x04)
      .writeC(gameservers.length)
      .writeC(0x00); // Last server. 0 for normal sorting

    for (let i = 0; i < gameservers.length; i++) {
      const gameserver = gameservers[i];
      const octets = gameserver.host.split(".");

      this._packet.writeC(gameserver.id)
      .writeC(Number(octets[0]))
      .writeC(Number(octets[1]))
      .writeC(Number(octets[2]))
      .writeC(Number(octets[3]))
      .writeD(gameserver.port)
      .writeC(gameserver.ageLimit)
      .writeC(gameserver.isPvP ? 0x01 : 0x00)
      .writeH(playersOnline)
      .writeH(gameserver.maxPlayers)
      .writeC(gameserver.status)
      .writeD(gameserver.type);
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ServerList;