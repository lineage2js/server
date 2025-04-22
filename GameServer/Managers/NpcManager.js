const EventEmitter = require('events');
const Npc = require('./../../GameServer/Models/Npc');
const database = require('./../../Database');
const npcsList = require('./../../GameServer/data/npcsList.json');
const spawnList = require('./../../GameServer/data/spawnList.json');

class NpcManager extends EventEmitter {
  constructor() {
    super();    

    this._npcs = []
  }

  spawn(npc) {
    this._npcs.push(npc);
    this.emit('spawn', npc);
  }

  async enable() {
    await this.spawnNpcs();
  }

  async spawnNpcs() {
    for (let i = 0; i < spawnList.length; i++) {
      const spawnData = spawnList[i];
      const npcData = npcsList.find(data => data.id === spawnData.npcId);

      for(let j = 0; j < spawnData.count; j++) {
        const npc = new Npc();

        npc.on('move', () => {
          this.emit('move', npc);
        });

        npc.on('updatePosition', () => {
          this.emit('updatePosition', npc);
        });

        npc.on('attack', () => {
          this.emit('attack', npc);
        });

        npc.on('stop', () => {
          this.emit('stop', npc);
        })

        npc.update(npcData);
        
        npc.objectId = await database.getNextObjectId();
        
        const positions = this._getRandomPos();

        npc.x = positions[0];
        npc.y = positions[1];
        npc.z = -3115;
        npc.maximumHp = npc.hp; // fix

        npc.on('died', () => {
          this.remove(npc);
          this.spawnNpcs();
        });

        npc.enable();
        this.spawn(npc);
      }
    }
  }

  remove(npc) { // fix
    const npcRemove = this._npcs.indexOf(npc);

    this._npcs.splice(npcRemove, 1);
  }
  
  getSpawnedNpcs() {
    return this._npcs;
  }

  getNpcByObjectId(objectId) {
    const npc = this._npcs.find(npc => npc.objectId === objectId);

    return npc;
  }

  _getRandomPos() {
		let max = { x: -80000, y: 270000 };
		let min = { x: -60000, y: 250000 };
		let xp = [-71921, -72081, -72277, -72105];
		let yp = [257496, 257310, 257480, 257686];
		let x;
		let y;
			
		do {
			x = Math.floor(min.x + Math.random() * (max.x + 1 - min.x));
			y = Math.floor(min.y + Math.random() * (max.y + 1 - min.y));
		} while(!this._inPoly(xp, yp, x, y))

		return [x, y]
	}

  _inPoly(xp, yp, x, y){
		let npol = xp.length;
		let j = npol - 1;
		let c = false;

		for (let i = 0; i < npol; i++){
			if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) &&
				(x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
				c = !c
			}
			j = i;
		}

		return c;
	}
}

module.exports = new NpcManager();

