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
    // const spawnedNpcs = npcs.getSpawnedNpcs();

    // player.x = -72146;
    // player.y = 257160;

    this._client.sendPacket(new serverPackets.UserInfo(player));
    this._client.sendPacket(new serverPackets.SunRise());

    //let objectId = await database.getNextObjectId();

    //spawnedNpcs.forEach(npc => {
      // this._client.sendPacket(new serverPackets.NpcInfo(npc));

      // let path = {
      //   target: {
      //     x: -72727,
      //     y: 258599,
      //     z: -3115
      //   },
      //   origin: {
      //     x: npc.x,
      //     y: npc.y,
      //     z: npc.z
      //   }
      // }

      // let angle = Math.atan2(path.target.y - path.origin.y, path.target.x - path.origin.x);

      //
      // npc.on('attacked', (playerObjectId) => {
      //   tasks.findById(`npc:${npc.objectId}:move`).forEach(task => {
      //     task.remove();
      //   });

      //   this._client.sendPacket(new serverPackets.StopMove(npc.objectId, npc.x, npc.y, npc.z));
      //   this._client.sendPacket(new serverPackets.Attack(npc, playerObjectId));
      // })
      //

      // tasks.add({
      //   id: `npc:${npc.objectId}:move`,
      //   time: 1000,
      //   callback: (event) => {
      //     npc.x = npc.x + ((Math.cos(angle) * 22));
      //     npc.y = npc.y + ((Math.sin(angle) * 22));
          
      //     const dx = path.target.x - npc.x;
      //     const dy = path.target.y - npc.y;
      //     const distance = (Math.sqrt(dx * dx + dy * dy)) - (10);
  
      //     if (distance < 22) {
      //       //npc.x = npc.x + ((Math.cos(angle) * distance));
      //       //npc.y = npc.y + ((Math.sin(angle) * distance));

      //       if (path.target.x === -72727) {
      //         path.target.x = -71061;
      //         path.target.y = 257191;

      //         path.origin.x = npc.x;
      //         path.origin.y = npc.y;

      //         angle = Math.atan2(path.target.y - path.origin.y, path.target.x - path.origin.x);

      //         this._client.sendPacket(new serverPackets.MoveToLocation(path, npc.objectId));

      //         return;
      //       }

      //       if (path.target.x === -71061) {
      //         path.target.x = -72727;
      //         path.target.y = 258599;

      //         path.origin.x = npc.x;
      //         path.origin.y = npc.y;

      //         angle = Math.atan2(path.target.y - path.origin.y, path.target.x - path.origin.x);

      //         this._client.sendPacket(new serverPackets.MoveToLocation(path, npc.objectId));
      //       }

      //       //event.stop();
      //     }

      //     // this._client.sendPacket(new serverPackets.DropItem(npc, {
      //     //   objectId: objectId,
      //     //   itemId: 57,
      //     //   x: npc.x,
      //     //   y: npc.y,
      //     //   z: npc.z
      //     // }));

      //     // setTimeout((function(client, objId) {
      //     //   return function() {
      //     //     client.sendPacket(new serverPackets.DeleteObject(objId));
      //     //   }
      //     // })(this._client, objectId), 5000);

      //     // objectId++;
      //   }
      // });

      // tasks.start(`npc:${npc.objectId}:move`);

      //this._client.sendPacket(new serverPackets.MoveToLocation(path, npc.objectId));
    //});
  }
}

module.exports = EnterWorld;