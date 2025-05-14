const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestMagicSkillUse {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD()
      .readC();

    this._init();
  }

  get skillId() {
    return this._data.getData()[1];
  }

  get data0() { // fix?
    return this._data.getData()[2];
  }

  get data1() {
    return this._data.getData()[3];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    this._client.sendPacket(new serverPackets.MagicSkillUse(player, {
      id: this.skillId,
      level: 1,
      hitTime: 1000, //1.08,
      reuseDelay: 1000 //13
    }));

    this._client.sendPacket(new serverPackets.MagicSkillLaunched(player, {
      id: this.skillId,
      level: 1
    }));

    //console.log(this.skillId, this.data0, this.data1);
  }
}

module.exports = RequestMagicSkillUse;