const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestItemList {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()

    this._init();
  }


  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const items = player.inventory.getItems();

    this._client.sendPacket(new serverPackets.ItemList(items, true));
  }
}

module.exports = RequestItemList;