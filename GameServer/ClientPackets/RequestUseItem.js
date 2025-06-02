const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestUseItem {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD();

    this._init();
  }

  get objectId() {
    return this._data.getData()[1];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const item = player.getItemByObjectId(this.objectId);
    
    if (item.itemName === 'world_map') {
      this._client.sendPacket(new serverPackets.ShowMiniMap(item.itemId));

      return;
    }
  }
}

module.exports = RequestUseItem;