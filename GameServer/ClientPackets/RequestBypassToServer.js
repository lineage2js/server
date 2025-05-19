const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const playersManager = require('./../Managers/PlayersManager');
const npcManager = require('./../Managers/NpcManager');

class RequestBypassToServer {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readS();

    this._init();
  }

  get command() {
    return this._data.getData()[1];
  }


  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const npc = npcManager.getNpcById(player.lastTalkedNpcId);

    //
    const fs = require('fs');
    const path = require('path');
    const html = fs.readFileSync(path.resolve(__dirname, './../../Data/html/noquest.htm'), 'utf8');
    //
    this._client.sendPacket(new serverPackets.NpcHtmlMessage(html));
    this._client.sendPacket(new serverPackets.ActionFailed()); // fix?
  }
}

module.exports = RequestBypassToServer;