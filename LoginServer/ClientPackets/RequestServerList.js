const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');

class RequestServerList {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD();

    this._init();
  }

  get sessionKey1() {
    const sessionKey1 = [];

    sessionKey1[0] = this._data.getData()[1].toString(16);
    sessionKey1[1] = this._data.getData()[2].toString(16);

    return sessionKey1;
  }

  async _init() {
    const gameservers = await database.getGameServers();
    const playersOnline = await database.getCharactersOnline();

    this._client.sendPacket(new serverPackets.ServerList(gameservers, playersOnline));
  }
}

module.exports = RequestServerList;