const EventEmitter = require('events');
const Npc = require('./../../GameServer/Models/Npc');
const database = require('./../../Database');
const npcsList = require('./../../Data/npcsList.json');
const spawnList = require('./../../Data/spawnList.json');

class NpcManager extends EventEmitter {
  constructor() {
    super();    

    this._npcs = [];
  }

  spawn(npc) {
    this._npcs.push(npc);
    console.log(this._npcs.length)
    this.emit('spawn', npc);
  }

  async enable() {
    await this.spawnNpcs();
  }

  async spawnNpcs() {    
    for (let i = 0; i < spawnList.length; i++) {
      const spawnData = spawnList[i];

      for(let j = 0; j < spawnData['npcMakers']['npcs'].length; j++) {
        const npcItem = spawnData['npcMakers']['npcs'][j];
        const npcData = npcsList.find(data => data.name === npcItem.name);

        for(let k = 0; k < npcItem.total; k++) {
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
          });

          npc.on('changeMove', () => {
            this.emit('changeMove', npc);
          });

          npc.on('died', () => {
            this.emit('died', npc);
            this.remove(npc);
            
            setTimeout(() => {
              this.spawnNpc(npc.id);
            }, 2000);
          });

          npc.update(npcData);
          
          npc.objectId = await database.getNextObjectId();
          
          let positions;

          if (npcItem.pos === 'anywhere') {
            //console.log(npcItem.name, spawnData['territory']['coordinates'])
            positions = this._getRandomPos(spawnData['territory']['coordinates']);
          }

          if (Array.isArray(npcItem.pos)) {
            npc.x = npcItem.pos[0];
            npc.y = npcItem.pos[1];
            npc.z = npcItem.pos[2];
            npc.heading = npcItem.pos[3];
          } else {
            npc.x = positions[0];
            npc.y = positions[1];
            npc.z = (spawnData['territory']['coordinates'][0]['zMin'] + spawnData['territory']['coordinates'][0]['zMax']) / 2;
          }

          npc.maximumHp = npc.hp; // fix
          
          this.spawn(npc);

          if (npc.type === 'warrior') {
            npc.enable(); // fix. По AI ждать 5 сек
          }
        }
      } 
    }

    console.log('spawn end')
  }

  async spawnNpc(id) {
    const npcData = npcsList.find(npcItem => npcItem.id === id);
    const npc = new Npc();

    npc.update(npcData);

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
    });

    npc.on('changeMove', () => {
      this.emit('changeMove', npc);
    });

    npc.on('died', () => {
      this.emit('died', npc);
      this.remove(npc);
      
      setTimeout(() => {
        this.spawnNpc(npc.id);
      }, 2000);
    });

    npc.objectId = await database.getNextObjectId();
        
    const positions = this._getRandomPos(spawnList[0]['territory']['coordinates']); // fix

    npc.x = positions[0];
    npc.y = positions[1];
    npc.z = -3115;
    npc.maximumHp = npc.hp; // fix

    this.spawn(npc);
    npc.enable();
  }

  remove(npc) { // fix так же удалять из EntitiesManager
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

  _getRandomPos(coordinates) {
    let xp = coordinates.map(i => i.x);
    let yp = coordinates.map(i => i.y);

		let max = { x: Math.max(...xp), y: Math.max(...yp) };
		let min = { x: Math.min(...xp), y: Math.min(...yp) };
		// let xp = [-71988, -71390, -72283, -72895];
		// let yp = [256706, 257435, 258192, 257464];
    
		let x;
		let y;
			
		do {
			x = Math.floor(min.x + Math.random() * (max.x + 1 - min.x));
			y = Math.floor(min.y + Math.random() * (max.y + 1 - min.y));
		} while(!this._inPoly(xp, yp, x, y))

		return [x, y];
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

