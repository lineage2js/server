const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const players = require('./../Models/Players');
const config = require('./../../config');

class RequestAuthLogin {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readS()
      .readD()
      .readD()
      .readD()
      .readD();

    this._init();
  }

  get login() {
    return this._data.getData()[1];
  }

  get sessionKey1() {
    const sessionKey1 = [];

    sessionKey1[0] = this._data.getData()[4].toString(16);
    sessionKey1[1] = this._data.getData()[5].toString(16);

    return sessionKey1;
  }

  get sessionKey2() {
    const sessionKey2 = [];

    sessionKey2[0] = this._data.getData()[3].toString(16);
    sessionKey2[1] = this._data.getData()[2].toString(16);

    return sessionKey2;
  }

  async _init() {
    if (this._client.getProtocolVersion() !== config.main.CLIENT_PROTOCOL_VERSION) {
      return;
    }

    const player = players.getPlayerByClient(this._client);
    const characters = await database.getCharactersByLogin(this.login);

    player.update({
      login: this.login
    });

    this._client.sendPacket(new serverPackets.CharacterSelectInfo(this.login, characters));
  }
}

module.exports = RequestAuthLogin;