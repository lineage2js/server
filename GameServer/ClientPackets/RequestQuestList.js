const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");

class RequestQuestList {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);

    this._init();
  }

  _init() {
    this._client.sendPacket(new serverPackets.QuestList());
  }
}

module.exports = RequestQuestList;