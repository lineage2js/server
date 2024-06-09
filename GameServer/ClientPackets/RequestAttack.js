const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const players = require('./../Models/Players');
const npcs = require('./../Models/Npcs');
const tasks = require('./../libs/tasks');
const database = require('./../../Database');

class RequestAttack {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD()
      .readD()
      .readD()
      .readC();

    this._init();
  }

  get objectId() {
    return this._data.getData()[1];
  }

  get x() {
    return this._data.getData()[2];
  }

  get y() {
    return this._data.getData()[3];
  }

  get z() {
    return this._data.getData()[4];
  }

  get attackId() {
    return this._data.getData()[5]; // 0 - click, 1 - shift click
  }

  async _start() {
    const player = players.getPlayerByClient(this._client);

    tasks.findById(`move:${player.objectId}`).forEach(task => {
      task.remove();
    });

    const npc = npcs.getNpcByObjectId(this.objectId);
    const path = {
      target: {
        x: npc.x,
        y: npc.y,
        z: npc.z
      },
      origin: {
        x: player.x,
        y: player.y,
        z: player.z
      }
    }

    let angle = Math.atan2(path.target.y - path.origin.y, path.target.x - path.origin.x);

    let objectId = await database.getNextObjectId();
    
    const dx = path.target.x - path.origin.x;
    const dy = path.target.y - path.origin.y;
    
    let distance = Math.sqrt(dx * dx + dy * dy) - (10);

    //console.log('distance', distance)

    // if (distance < 10) {
    //   player.attack(this.objectId);

    //   setTimeout(() => {
    //     this._start();
    //   }, 500000 / 303);

    //   return;
    // }

    if (distance <= 0) {
      return;
    }

    // walk
    if (distance < 36) {
      const d = distance; // fix

      tasks.add({
        id: `move:${player.objectId}`,
        time: (1000 / 88) * distance,
        callback: (event) => {
          if (event.runs === 1) {
            event.stop();           
          }

          player.update({
            x: player.x + (Math.cos(angle) * d), // забирается из вне. Значение стирается
            y: player.y + (Math.sin(angle) * d),
            z: player.z
          });

          player.attack(this.objectId);

          // this._client.sendPacket(new serverPackets.DropItem(player, {
          //   objectId: objectId,
          //   itemId: 1, // Short Sword
          //   x: player.x,
          //   y: player.y,
          //   z: player.z
          // }));

          // setTimeout((function(client, objId) {
          //   return function() {
          //     client.sendPacket(new serverPackets.DeleteObject(objId));
          //   }
          // })(this._client, objectId), 5000);

          // objectId++;

          setTimeout(() => {
            const npc = npcs.getNpcByObjectId(this.objectId);
            const dx = npc.x - player.x;
            const dy = npc.y - player.y;
      
            let distance = Math.sqrt(dx * dx + dy * dy) - (10);

            if (distance > 0) {
              this._start();
            }
          }, 500000 / 303);
        }
      });

      distance = 0;
    }

    // walk
    if (distance > 36) {
      tasks.add({
        id: `move:${player.objectId}`,
        time: (1000 / 88) * 36,
        callback: (event) => {
          if (event.runs === 1) {
            event.stop();
          }
  
          player.update({
            x: player.x + (Math.cos(angle) * 36),
            y: player.y + (Math.sin(angle) * 36),
            z: player.z
          });

          // this._client.sendPacket(new serverPackets.DropItem(player, {
          //   objectId: objectId,
          //   itemId: 118, // Necklace
          //   x: player.x,
          //   y: player.y,
          //   z: player.z
          // }));

          // setTimeout((function(client, objId) {
          //   return function() {
          //     client.sendPacket(new serverPackets.DeleteObject(objId));
          //   }
          // })(this._client, objectId), 5000);

          // objectId++;
        }
      });

      distance = distance - 36;
    }
    
    if (distance > 0 && distance < 126) {
      const d = distance; // fix

      tasks.add({
        id: `move:${player.objectId}`,
        time: (1000 / 126) * distance,
        callback: (event) => {
          if (event.runs === 1) {
            event.stop();
          }

          player.update({
            x: player.x + (Math.cos(angle) * d),
            y: player.y + (Math.sin(angle) * d),
            z: player.z
          });

          player.attack(this.objectId);

          // this._client.sendPacket(new serverPackets.DropItem(player, {
          //   objectId: objectId,
          //   itemId: 2516, // Saber*Saber
          //   x: player.x,
          //   y: player.y,
          //   z: player.z
          // }));

          // setTimeout((function(client, objId) {
          //   return function() {
          //     client.sendPacket(new serverPackets.DeleteObject(objId));
          //   }
          // })(this._client, objectId), 5000);

          // objectId++;

          setTimeout(() => {
            const npc = npcs.getNpcByObjectId(this.objectId);
            const dx = npc.x - player.x;
            const dy = npc.y - player.y;
      
            let distance = Math.sqrt(dx * dx + dy * dy) - (10);

            if (distance > 0) {
              this._start();
            }
          }, 500000 / 303);
        }
      });

      distance = 0;
    }

    if (distance > 126) {
      tasks.add({
        id: `move:${player.objectId}`,
        time: 1000,
        callback: (event) => {
          player.update({
            x: player.x + (Math.cos(angle) * 126),
            y: player.y + (Math.sin(angle) * 126),
            z: player.z
          });
          
          //
          const npc = npcs.getNpcByObjectId(this.objectId);
          const path = {
            target: {
              x: npc.x,
              y: npc.y,
              z: npc.z
            },
            origin: {
              x: player.x,
              y: player.y,
              z: player.z
            }
          }

          angle = Math.atan2(path.target.y - path.origin.y, path.target.x - path.origin.x);

          this._client.sendPacket(new serverPackets.MoveToLocation(path, player.objectId));
          //

          // this._client.sendPacket(new serverPackets.DropItem(player, {
          //   objectId: objectId,
          //   itemId: 57, // Adena
          //   x: player.x,
          //   y: player.y,
          //   z: player.z
          // }));

          // setTimeout((function(client, objId) {
          //   return function() {
          //     client.sendPacket(new serverPackets.DeleteObject(objId));
          //   }
          // })(this._client, objectId), 5000);

          // objectId++;
          
          const dx = path.target.x - player.x;
          const dy = path.target.y - player.y;
          const distance = Math.sqrt(dx * dx + dy * dy) - (10);
  
          if (distance > 0 && distance < 126) {
            tasks.add({
              id: `move:${player.objectId}`,
              time: (1000 / 126) * distance,
              callback: (event) => {
                if (event.runs === 1) {
                  event.stop();
                }
         
                player.update({
                  x: player.x + (Math.cos(angle) * (distance)),
                  y: player.y + (Math.sin(angle) * (distance)),
                  z: player.z
                });

                player.attack(this.objectId);
      
                // this._client.sendPacket(new serverPackets.DropItem(player, {
                //   objectId: objectId,
                //   itemId: 1060, // Healing Potion
                //   x: player.x,
                //   y: player.y,
                //   z: player.z
                // }));

                // setTimeout((function(client, objId) {
                //   return function() {
                //     client.sendPacket(new serverPackets.DeleteObject(objId));
                //   }
                // })(this._client, objectId), 5000);
      
                // objectId++;
        
                setTimeout(() => {
                  const npc = npcs.getNpcByObjectId(this.objectId);
                  const dx = npc.x - player.x;
                  const dy = npc.y - player.y;
            
                  let distance = Math.sqrt(dx * dx + dy * dy) - (10);
      
                  if (distance > 0) {
                    this._start();
                  }
                }, 500000 / 303);
              }
            });

            event.stop();
          }
        }
      });
    }

    tasks.start(`move:${player.objectId}`);
    
    this._client.sendPacket(new serverPackets.MoveToLocation(path, player.objectId));
  }

  async _init() {
    this._start();
  }
}

module.exports = RequestAttack;