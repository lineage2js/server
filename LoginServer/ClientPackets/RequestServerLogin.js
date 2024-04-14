const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");

class RequestServerLogin {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD()
      .readC();

    this._init();
  }

  get sessionKey1() {
    const sessionKey1 = [];

    sessionKey1[0] = this._data.getData()[1].toString(16);
    sessionKey1[1] = this._data.getData()[2].toString(16);

    return sessionKey1;
  }

  get serverNumber() {
    return this._data.getData()[3];
  }

  _init() {
    this._client.sendPacket(new serverPackets.PlayOk([0x00000000, 0x00000000]));
  }
}

module.exports = RequestServerLogin;