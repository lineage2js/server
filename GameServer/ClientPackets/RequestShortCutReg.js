const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const serverPackets = require('./../ServerPackets/serverPackets');

class RequestShortCutReg {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD()
      .readD()
      .readD();

    this._init();
  }

  get type() {
    return this._data.getData()[1];
  }

  get slot() {
    return this._data.getData()[2];
  }

  get id() {
    return this._data.getData()[3];
  }

  get unk() { // characterType ? fix
    return this._data.getData()[4];
  }

  _init() {
    //const player = playersManager.getPlayerByClient(this._client);

    this._client.sendPacket(new serverPackets.ShortCutRegister(this.slot, this.type, this.id, -1, this.unk))
  }
}

module.exports = RequestShortCutReg;