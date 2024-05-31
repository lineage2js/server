const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const players = require('./../Models/Players');
const npcs = require('./../Models/Npcs');
const tasks = require('./../libs/tasks');
const database = require('./../../Database');

class EnterWorld {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC();

    this._init();
  }

  async _init() {
    const player = players.getPlayerByClient(this._client);
    const spawnedNpcs = npcs.getSpawnedNpcs();

    player.x = -72146;
    player.y = 257160;

    this._client.sendPacket(new serverPackets.UserInfo(player));
    this._client.sendPacket(new serverPackets.SunRise());

    let objectId = await database.getNextObjectId();

    spawnedNpcs.forEach(npc => {
      this._client.sendPacket(new serverPackets.NpcInfo(npc));

      const path = {
        target: {
          x: -72727,
          y: 258599,
          z: -3115
        },
        origin: {
          x: npc.x,
          y: npc.y,
          z: npc.z
        }
      }

      const angle = Math.atan2(path.target.y - path.origin.y, path.target.x - path.origin.x);

      tasks.add({
        id: `npc:${npc.objectId}:move`,
        time: 1000,
        callback: (event) => {
          npc.x = npc.x + ((Math.cos(angle) * 55));
          npc.y = npc.y + ((Math.sin(angle) * 55));
          
          const dx = path.target.x - npc.x;
          const dy = path.target.y - npc.y;
          const distance = (Math.sqrt(dx * dx + dy * dy)) - (10);
  
          if (distance < 55) {
            npc.x = npc.x + ((Math.cos(angle) * distance));
            npc.y = npc.y + ((Math.sin(angle) * distance));

            event.stop();
          }

          this._client.sendPacket(new serverPackets.DropItem(npc, {
            objectId: objectId,
            itemId: 57,
            x: npc.x,
            y: npc.y,
            z: npc.z
          }));
        }
      });

      tasks.start(`npc:${npc.objectId}:move`);

      this._client.sendPacket(new serverPackets.MoveToLocation(path, npc.objectId));
    });
  }
}

module.exports = EnterWorld;