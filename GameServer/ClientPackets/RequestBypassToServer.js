const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const playersManager = require('./../Managers/PlayersManager');
const npcManager = require('./../Managers/NpcManager');
const aiManager = require('./../Managers/AiManager');

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
    if (this.command === 'admin_show_panel') {
      //
      const fs = require('fs');
      const path = require('path');
      const html = fs.readFileSync(path.resolve(__dirname, './../../Data/html/admin/panel.htm'), 'utf8');
      //
      this._client.sendPacket(new serverPackets.NpcHtmlMessage(html));

      return;
    }
    
    if (this.command === 'admin_show_teleports') {
      //
      const fs = require('fs');
      const path = require('path');
      const html = fs.readFileSync(path.resolve(__dirname, './../../Data/html/admin/teleports.htm'), 'utf8');
      //
      this._client.sendPacket(new serverPackets.NpcHtmlMessage(html));

      return;
    }

    if (this.command.includes('admin_teleport')) {
      const player = playersManager.getPlayerByClient(this._client);
      const [x, y, z] = this.command.split(' ').slice(1).map(i => Number(i)); // fix
      
      this._client.sendPacket(new serverPackets.TeleportToLocation(player.objectId, x, y, z));

      return;
    }
    
    const player = playersManager.getPlayerByClient(this._client);
    const npc = npcManager.getNpcById(player.lastTalkedNpcId);

    //
    if (npc.npcAi.ai === 'carl') {
      if (this.command === 'talk_select') {
        aiManager.onTalkSelect('carl', player);
      }
      
      return;
    }
    //
    
    const fs = require('fs');
    const path = require('path');
    const html = fs.readFileSync(path.resolve(__dirname, './../../Data/html/noquest.htm'), 'utf8');
    
    this._client.sendPacket(new serverPackets.NpcHtmlMessage(html));
    this._client.sendPacket(new serverPackets.ActionFailed()); // fix?
  }
}

module.exports = RequestBypassToServer;