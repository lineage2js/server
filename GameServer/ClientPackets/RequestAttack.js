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

  async _init() {
    const player = players.getPlayerByClient(this._client);

    // tasks.findById(`move:${player.objectId}`).forEach(task => {
    //   task.remove();
    // });

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
    
    let distance = Math.sqrt(dx * dx + dy * dy) - (10 + 9);

    // walk
    if (distance < 36) {
      const d = distance; // fix

      tasks.add({
        id: `move:${player.objectId}`,
        time: (1000 / 88) * distance,
        callback: (event) => {
          if (event.runs === 1) {
            event.stop();

            player.attack(this.objectId);
          }
          
          player.update({
            x: player.x + (Math.cos(angle) * d), // забирается из вне. Значение стирается
            y: player.y + (Math.sin(angle) * d),
            z: player.z
          });

          this._client.sendPacket(new serverPackets.DropItem(player, {
            objectId: objectId,
            itemId: 57,
            x: player.x,
            y: player.y,
            z: player.z
          }));
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

          this._client.sendPacket(new serverPackets.DropItem(player, {
            objectId: objectId,
            itemId: 57,
            x: player.x,
            y: player.y,
            z: player.z
          }));
        }
      });

      distance = distance - 36;
    }

    if (distance < 126) {
      const d = distance; // fix

      tasks.add({
        id: `move:${player.objectId}`,
        time: (1000 / 126) * distance,
        callback: (event) => {
          if (event.runs === 1) {
            event.stop();

            player.attack(this.objectId);
          }

          player.update({
            x: player.x + (Math.cos(angle) * d),
            y: player.y + (Math.sin(angle) * d),
            z: player.z
          });

          this._client.sendPacket(new serverPackets.DropItem(player, {
            objectId: objectId,
            itemId: 57,
            x: player.x,
            y: player.y,
            z: player.z
          }));
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

          this._client.sendPacket(new serverPackets.DropItem(player, {
            objectId: objectId,
            itemId: 57,
            x: player.x,
            y: player.y,
            z: player.z
          }));
          
          const dx = path.target.x - player.x;
          const dy = path.target.y - player.y;
          const distance = Math.sqrt(dx * dx + dy * dy) - (10 + 9);
  
          if (distance < 126) {
            event.stop();
          }
        }
      });
    }

    function calculateFinalDistance() {
      let x = player.x;
      let y = player.y;

      let dx = path.target.x - x;
      let dy = path.target.y - y;
      let distance = Math.sqrt(dx * dx + dy * dy) - 36 - (10 + 9);
      
      while(distance > 126) {
        x = x + (Math.cos(angle) * 126);
        y = y + (Math.sin(angle) * 126);

        dx = path.target.x - x;
        dy = path.target.y - y;
        distance = Math.sqrt(dx * dx + dy * dy) - 36 - (10 + 9);
      }

      return distance;
    }

    if (distance > 126 && (distance % 126) > 0) {
      const finalDistance = calculateFinalDistance();

      tasks.add({
        id: `move:${player.objectId}`,
        time: (1000 / 126) * finalDistance,
        callback: (event) => {
          if (event.runs === 1) {
            event.stop();
          }
  
          player.update({
            x: player.x + (Math.cos(angle) * (finalDistance)),
            y: player.y + (Math.sin(angle) * (finalDistance)),
            z: player.z
          });

          this._client.sendPacket(new serverPackets.DropItem(player, {
            objectId: objectId,
            itemId: 57,
            x: player.x,
            y: player.y,
            z: player.z
          }));
  
          player.attack(this.objectId);
        }
      });
    }

    tasks.start(`move:${player.objectId}`);
    
    this._client.sendPacket(new serverPackets.MoveToLocation(path, player.objectId));

    //this._client.sendPacket(new serverPackets.MoveToPawn(player, npc, 19));
  }
}

module.exports = RequestAttack;