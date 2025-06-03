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
    
    if (item.isEquippable) {
      if (item.equipSlot === 'chest') {
        player.chest.objectId = item.objectId;
        player.chest.itemId = item.itemId;
        
        item.toggleEquip();
      }

      if (item.equipSlot === 'legs') {
        player.legs.objectId = item.objectId;
        player.legs.itemId = item.itemId;
        
        item.toggleEquip();
      }
      
      if (item.equipSlot === 'rhand') {
        player.hand.right.objectId = item.objectId;
        player.hand.right.itemId = item.itemId;
        
        item.toggleEquip();
      }
    }

    this._client.sendPacket(new serverPackets.UserInfo(player));
		this._client.sendPacket(new serverPackets.ItemList(player.getItems()));
  }
}

module.exports = RequestUseItem;