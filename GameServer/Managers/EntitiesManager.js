//
const database = require('./../../Database');
//

class EntitiesManager {
  constructor() {
    this._entities = [];
  }

  getEntityByObjectId(objectId) {
    return this._entities.find(entity => entity.objectId === objectId);
  }

  async enable() {
    const npcManager = require('./NpcManager');
    const playersManager = require('./PlayersManager');
    const serverPackets = require('./../ServerPackets/serverPackets');

    npcManager.on('spawn', npc => {
      this._entities.push(npc);

      const packet = new serverPackets.NpcInfo(npc);
      
      playersManager.emit('notify', packet);
    });

    // let objectId = await database.getNextObjectId();

    // npcManager.on('updatePosition', npc => {
    //   const packet = new serverPackets.DropItem(npc, {
    //     objectId: objectId,
    //     itemId: 57,
    //     x: npc.x,
    //     y: npc.y,
    //     z: npc.z
    //   });
      
    //   playersManager.emit('notify', packet);

    //   // setTimeout((function(objId) {
    //   //   return function() {
    //   //     playersManager.emit('notify', new serverPackets.DeleteObject(objId));
    //   //   }
    //   // })(objectId), 1000);

    //   objectId++;
    // });

    npcManager.on('move', npc => {
      const packet = new serverPackets.MoveToLocation(npc.path, npc.objectId);
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('attack', npc => {
      const packet = new serverPackets.Attack(npc, npc.target);
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('changeMove', npc => {
      const packet = new serverPackets.ChangeMoveType(npc.objectId, 1); // running
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('stop', npc => {
      const packet = new serverPackets.StopMove(npc.objectId, npc.x, npc.y, npc.z);

      playersManager.emit('notify', packet);
    });

    npcManager.on('died', async npc => {
      playersManager.emit('notify', new serverPackets.StatusUpdate(npc.objectId, 0, npc.maximumHp));
      playersManager.emit('notify', new serverPackets.Die(npc.objectId));
      playersManager.emit('notify', new serverPackets.DropItem(npc, {
        objectId: await database.getNextObjectId(),
        itemId: Math.floor(Math.random() * 100) + 1,
        x: npc.x + 10,
        y: npc.y - 10,
        z: npc.z
      }));

      setTimeout(() => {
        playersManager.emit('notify', new serverPackets.DeleteObject(npc.objectId));
      }, 3000);
    });

    playersManager.on('spawn', player => {
      this._entities.push(player);
    });
  }
}

module.exports = new EntitiesManager();