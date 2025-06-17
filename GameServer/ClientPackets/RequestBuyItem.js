const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestBuyItem {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD() // for ()
      .readD()
      .readD();

    this._init();
  }

  get listId() {
    return this._data.getData()[1];
  }

  get countItems() {
    return this._data.getData()[2];
  }

  get itemId() {
    return this._data.getData()[3];
  }

  get itemCount() { // fix?
    return this._data.getData()[4];
  }

  _init() {
    const player = playersManager.getPlayerByClient(this._client);

    console.log(this.itemId)
  }
}

module.exports = RequestBuyItem;