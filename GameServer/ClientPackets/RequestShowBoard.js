const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const playersManager = require('./../Managers/PlayersManager');

class RequestShowBoard {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD();

    this._init();
  }

  async _init() {
    //
    const fs = require('fs');
    const path = require('path');
    const html = fs.readFileSync(path.resolve(__dirname, './../../Data/html/board.htm'), 'utf8');
    //
    this._client.sendPacket(new serverPackets.ShowBoard(html));
  }
}

module.exports = RequestShowBoard;