const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const config = require('./../../config');

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

  _init() {
    this._client.sendPacket(new serverPackets.ServerList(config.gameserver.host, config.gameserver.port));
  }
}

module.exports = RequestServerList;