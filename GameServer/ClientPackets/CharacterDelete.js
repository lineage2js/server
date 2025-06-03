const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const playersManager = require('./../Managers/PlayersManager');

class CharacterDelete {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD();

    this._init();
  }

  get characterSlot () {
    return this._data.getData()[1];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const characters = await database.getCharactersByLogin(player.login);
    const character = characters[this.characterSlot];

    await database.deleteCharacterByObjectId(character.objectId);
    await database.deleteInventoryByObjectId(character.inventoryId);
    
    this._client.sendPacket(new serverPackets.CharacterDeleteOk());
    this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, await database.getCharactersByLogin(player.login))); // fix?
  }
}

module.exports = CharacterDelete;