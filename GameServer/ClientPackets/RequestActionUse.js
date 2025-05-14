const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const playersManager = require('./../Managers/PlayersManager');
const config = require('./../../config');

class RequestActionUse {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD()
      .readC();

    this._init();
  }

  get actionId() {
    return this._data.getData()[1];
  }
  
  get ctrlStatus() {
    return this._data.getData()[2];
  }
  
  get shiftStatus() {
    return this._data.getData()[3];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    if (this.actionId === 0) {
      this._client.sendPacket(new serverPackets.ChangeWaitType(player));

      return;
    }

    if (this.actionId === 1) {
      this._client.sendPacket(new serverPackets.ChangeMoveType(player.objectId, 0));

      return
    }
  }
}

module.exports = RequestActionUse;