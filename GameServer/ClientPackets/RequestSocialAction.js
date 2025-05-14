const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestSocialAction {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD();

    this._init();
  }

  get actionId() {
    return this._data.getData()[1];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    this._client.sendPacket(new serverPackets.SocialAction(player.objectId, this.actionId));
  }
}

module.exports = RequestSocialAction;