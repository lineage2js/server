const ServerPacket = require('./ServerPacket.js');

class ServerList {
  constructor(gameservers, playersOnline) {
    this._packet = new ServerPacket(1 + 3 + (gameservers.length * (16 + 4))); // fix size
    this._packet.writeC(0x04)
      .writeC(gameservers.length)
      .writeC(0x00); // Last server. 0 for normal sorting

    for (let i = 0; i < gameservers.length; i++) {
      const server = gameservers[i];
      const octets = server.host.split(".");

      this._packet.writeC(server.id)
      .writeC(Number(octets[0]))
      .writeC(Number(octets[1]))
      .writeC(Number(octets[2]))
      .writeC(Number(octets[3]))
      .writeD(server.port)
      .writeC(server.ageLimit)
      .writeC(server.isPvP ? 0x01 : 0x00)
      .writeH(playersOnline)
      .writeH(server.maxPlayers)
      .writeC(server.status)
      .writeD(server.type);
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ServerList;