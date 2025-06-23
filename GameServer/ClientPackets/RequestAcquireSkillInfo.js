const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const playersManager = require('./../Managers/PlayersManager');

class RequestAcquireSkillInfo {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD();

    this._init();
  }

  get skillId() {
    return this._data.getData()[1];
  }

  get skillLevel() {
    return this._data.getData()[2];
  }

  async _init() {
    // const player = playersManager.getPlayerByClient(this._client);
    // const character = await database.getCharacterByObjectId(player.objectId);

    // character.x = Math.floor(player.x); // fix, update all doc?
    // character.y = Math.floor(player.y);
    // character.z = Math.floor(player.z);

    // await database.updateCharacterByObjectId(character.objectId, character);

    console.log(this.skillId, this.skillLevel)

    //this._client.sendPacket(new serverPackets.LeaveWorld());
  }
}

module.exports = RequestAcquireSkillInfo;