const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const playersManager = require('./../Managers/PlayersManager');
const Item = require('./../Models/Item');

class CharacterSelected {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD();

    this._init();
  }

  get characterSlot () {
    return this._data.getData()[0];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const characters = await database.getCharactersByLogin(player.login);
    const character = characters[this.characterSlot];
    const inventory = await database.getInventoryByObjectId(character.inventoryId); // fix ?

    player.update(character);
    
    // fix
    for (let i = 0; i < inventory.items.length; i++) {
      const item = new Item( // fix
        inventory.items[i].objectId,
        inventory.items[i].itemId,
        inventory.items[i].consume_type,
        inventory.items[i].item_type,
        inventory.items[i].itemName,
        inventory.items[i].equipSlot,
      );

      player.addItem(item);
    }
    //
    
    this._client.sendPacket(new serverPackets.CharacterSelected(character));
  }
}

module.exports = CharacterSelected;