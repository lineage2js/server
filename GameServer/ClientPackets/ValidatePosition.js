const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const playersManager = require('./../Managers/PlayersManager');

class ValidatePosition {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC();

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
    
  }
}

module.exports = ValidatePosition;