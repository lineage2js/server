const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const players = require('./../Models/Players');

class RequestRestart {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC();

    this._init();
  }

  async _init() {
    const player = players.getPlayerByClient(this._client);
    const character = await database.getCharacterByObjectId(player.objectId);

    character.x = Math.floor(player.x); // fix, update all doc?
    character.y = Math.floor(player.y);
    character.z = Math.floor(player.z);

    await database.updateCharacterByObjectId(character.objectId, character);

    const allowRestart = true; // fix
    const characters = await database.getCharactersByLogin(player.login);

    this._client.sendPacket(new serverPackets.RestartResponse(allowRestart));
    this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
  }
}

module.exports = RequestRestart;