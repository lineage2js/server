const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const playersManager = require('./../Managers/PlayersManager');
const npcManager = require('./../Managers/NpcManager');
const aiManager = require('./../Managers/AiManager');
const npcHtmlMessagesManager = require('./../Managers/NpcHtmlMessagesManager');
const adminPanelManager = require('./../Managers/AdminPanelManager');

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
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('panel');

      this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }
    
    if (this.command === 'admin_show_teleports') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('teleports');

      this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

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
    if (this.command === 'talk_select') {
      aiManager.onTalkSelect(npc.ai.script, player);

      return;
    }
    //
    
    const htmlMessage = npcHtmlMessagesManager.getHtmlMessageByFileName('noquest.htm');
    
    this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));
    this._client.sendPacket(new serverPackets.ActionFailed()); // fix?
  }
}

module.exports = RequestBypassToServer;