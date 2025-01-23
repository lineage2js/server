const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const players = require('./../Models/Players');
const tasks = require('./../libs/tasks');
const database = require('./../../Database');

class Formuls {
  nextTickRunSpeed(speed) {
    return Math.round((0.1 /speed) * 1_000_000);
  }
}

class MoveBackwardToLocation {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD();

    this._init();
  }

  get targetX() {
    return this._data.getData()[1];
  }
  get targetY() {
    return this._data.getData()[2];
  }
  get targetZ() {
    return this._data.getData()[3];
  }
  get originX() {
    return this._data.getData()[4];
  }
  get originY() {
    return this._data.getData()[5];
  }
  get originZ() {
    return this._data.getData()[6];
  }

  async _init() {
    const player = players.getPlayerByClient(this._client);

    tasks.findById(`move:${player.objectId}`).forEach(task => {
      task.remove();
    });

    player.update({
      x: this.originX,
      y: this.originY,
      z: this.originZ
    });

    let objectId = await database.getNextObjectId();

    this._client.sendPacket(new serverPackets.DropItem(player, {
      objectId: objectId++,
      itemId: 57,
      x: player.x,
      y: player.y,
      z: player.z
    }));

    const path = {
      target: {
        x: this.targetX,
        y: this.targetY,
        z: this.targetZ
      },
      origin: {
        x: this.originX,
        y: this.originY,
        z: this.originZ
      }
    }

    let angle = Math.atan2(path.target.y - path.origin.y, path.target.x - path.origin.x);
    
    const dx = path.target.x - path.origin.x;
    const dy = path.target.y - path.origin.y;
    
    let distance = Math.sqrt(dx * dx + dy * dy) - (10);

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

          this._client.sendPacket(new serverPackets.DropItem(player, {
            objectId: objectId++,
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
            objectId: objectId++,
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
          }

          player.update({
            x: player.x + (Math.cos(angle) * d),
            y: player.y + (Math.sin(angle) * d),
            z: player.z
          });

          this._client.sendPacket(new serverPackets.DropItem(player, {
            objectId: objectId++,
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

          this._client.sendPacket(new serverPackets.DropItem(player, {
            objectId: objectId++,
            itemId: 57,
            x: player.x,
            y: player.y,
            z: player.z
          }));
          
          const dx = path.target.x - player.x;
          const dy = path.target.y - player.y;
          const distance = Math.sqrt(dx * dx + dy * dy) - (10);
  
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
      let distance = Math.sqrt(dx * dx + dy * dy) - 36 - (10);
      
      while(distance > 126) {
        x = x + (Math.cos(angle) * 126);
        y = y + (Math.sin(angle) * 126);

        dx = path.target.x - x;
        dy = path.target.y - y;
        distance = Math.sqrt(dx * dx + dy * dy) - 36 - (10);
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
            objectId: objectId++,
            itemId: 57,
            x: player.x,
            y: player.y,
            z: player.z
          }));
        }
      });
    }

    tasks.start(`move:${player.objectId}`);

    this._client.sendPacket(new serverPackets.MoveToLocation(path, player.objectId));
  }
}

module.exports = MoveBackwardToLocation;