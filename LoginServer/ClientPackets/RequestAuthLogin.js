const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');

class RequestAuthLogin {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readB(14)
      .readB(16);

    this._init();
  }

  get login() {
    return this._data.getData()[1].toString("ascii").replace(/\u0000/gi, "").toLowerCase();
  }

  get password() {
    return this._data.getData()[2].toString("ascii").replace(/\u0000/gi, "");
  }

  async _init() {
    const user = await database.getUserByLogin(this.login);

    if (!user) {
      this._client.sendPacket(new serverPackets.LoginFail(serverPackets.LoginFail.reason.REASON_USER_OR_PASS_WRONG));

      return;
    }

    if (user.password !== this.password) {
      this._client.sendPacket(new serverPackets.LoginFail(serverPackets.LoginFail.reason.REASON_PASS_WRONG));

      return;
    }

    this._client.sendPacket(new serverPackets.LoginOk([0x00000000, 0x00000000])); // fix
  }
}

module.exports = RequestAuthLogin;