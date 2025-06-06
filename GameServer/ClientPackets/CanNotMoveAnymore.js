const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");

class CanNotMoveAnymore {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD()
      .readD()
      .readD();

    this._init();
  }

  get x() {
    return this._data.getData()[1];
  }

  get y() {
    return this._data.getData()[2];
  }

  get z() {
    return this._data.getData()[3];
  }

  get heading() {
    return this._data.getData()[4];
  }

  async _init() {
    //this._client.sendPacket(new serverPackets.StopMoveWithLocation());
  }
}

module.exports = CanNotMoveAnymore;