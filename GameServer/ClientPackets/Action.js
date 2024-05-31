const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const players = require('./../Models/Players');

class Action {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD()
      .readD()
      .readD()
      .readC();

    this._init();
  }

  get objectId() {
    return this._data.getData()[1];
  }

  get originX() {
    return this._data.getData()[2];
  }

  get originY() {
    return this._data.getData()[3];
  }

  get originZ() {
    return this._data.getData()[4];
  }

  get actionId() {
    return this._data.getData()[5]; // 0 - click, 1 - shift click
  }

  _init() {
    const player = players.getPlayerByClient(this._client);

    this._client.sendPacket(new serverPackets.TargetSelected(this.objectId));

    player.target = this.objectId;
  }
}

module.exports = Action;