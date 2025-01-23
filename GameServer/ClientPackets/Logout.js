const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const players = require('./../Models/Players');

class Logout {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()

    this._init();
  }

  async _init() {
    const player = players.getPlayerByClient(this._client);
    const character = await database.getCharacterByLogin(player.login);

    character.x = Math.floor(player.x); // fix, update all doc?
    character.y = Math.floor(player.y);
    character.z = Math.floor(player.z);

    await database.updateCharacterByObjectId(character.objectId, character);

    this._client.sendPacket(new serverPackets.LeaveWorld());
  }
}

module.exports = Logout;