const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const npcManager = require('./../Managers/NpcManager');

class EnterWorld {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC();

    this._init();
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const spawnedNpcs = npcManager.getSpawnedNpcs();

    this._client.sendPacket(new serverPackets.UserInfo(player));
    this._client.sendPacket(new serverPackets.SunRise()); // TimeManager?

    // fix?
    playersManager.emit('spawn', player);
    //

    spawnedNpcs.forEach(npc => {
      this._client.sendPacket(new serverPackets.NpcInfo(npc));
      
      if (npc.state === 'move') {
        const path = {
          target: {
            x: npc.path.target.x,
            y: npc.path.target.y,
            z: -3115
          },
          origin: {
            x: npc.x,
            y: npc.y,
            z: npc.z
          }
        }

        this._client.sendPacket(new serverPackets.MoveToLocation(path, npc.objectId));
      }
    });
  }
}

module.exports = EnterWorld;