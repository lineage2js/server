const Character = require('./Character');
const serverPackets = require('./../ServerPackets/serverPackets');

//
const database = require('./../../Database');
const movingManager = require('./../Managers/MovingManager');
const npcManager = require('./../Managers/NpcManager');
let objectId;
//

function moveCloser(x1, y1, x2, y2, distance) {
  // Вычисляем разницу между координатами
  let dx = x2 - x1;
  let dy = y2 - y1;

  // Вычисляем расстояние между точками
  let dist = Math.sqrt(dx * dx + dy * dy);

  // Нормализуем вектор разницы
  let nx = dx / dist;
  let ny = dy / dist;

  // Перемещаем точку (x2, y2) ближе на заданное расстояние
  let newX = x2 - nx * distance;
  let newY = y2 - ny * distance;

  return { x: newX, y: newY };
}

class Player extends Character {
  constructor(client) {
    super();

    this._client = client;
    this.target = null;
    this.positionUpdateTimestamp = 0;
    this.state = '';
    this.job = '';
    this.isMoving = false;
    this.isAttacking = false;

    this._init();
  }

  async _init() {
    objectId = await database.getNextObjectId();
  }

  getClient() {
    return this._client;
  }

  updateJob(job, payload) {
    this.job = job;

    switch(job) {
      case 'move':
        this.updateState('move', payload);
        this._client.sendPacket(new serverPackets.MoveToLocation(payload, this.objectId));
        
        break;
      case 'attack':
        this.updateState('attack', payload);

        break;
    }
  }

  updateState(state, payload) {
    this.state = state;

    switch(state) {
      case 'move':
        this.move(payload);
        
        break;
      case 'follow':
        this.follow(payload);

        break;
      case 'attack':
        this.attack(payload);

        break;
      case 'stop':
        this.stop();

        break;
    }
  }

  move(path) {
    this.path = path;

    if (!this.isMoving) {
      movingManager.registerMovingObject(this);

      this.positionUpdateTimestamp = Date.now();
      this.isMoving = true;
    }

    // cancel job if change job. Stop attack if attack => move;
    if (this.job === 'move') {
      this.isAttacking = false;
    }
  }

  follow(path) { // objectId
    this.move(path);

    function tick() {
      if (this.state !== 'follow') {
        return;
      }
      
      const npc = npcManager.getNpcByObjectId(this.target);

      this.path.origin.x = this.x;
      this.path.origin.y = this.y;
      this.path.target.x = npc.x;
      this.path.target.y = npc.y;

      const p = moveCloser(this.path.origin.x, this.path.origin.y, this.path.target.x, this.path.target.y, 20);

      this.path.target.x = p.x;
      this.path.target.y = p.y;

      this._client.sendPacket(new serverPackets.MoveToLocation(this.path, this.objectId));

      if (this.state === 'follow') {
        setTimeout(tick.bind(this), 100);
      }
    }

    tick.bind(this)();
  }

  attack(objectId) {
    if (this.job !== 'attack') {
      return; // fix?
    }

    const npc = npcManager.getNpcByObjectId(objectId);
    const path = {
      target: {
        x: npc.x,
        y: npc.y,
        z: npc.z
      },
      origin: {
        x: this.x,
        y: this.y,
        z: this.z
      }
    }

    this.path = path;

    const dx = this.path.target.x - this.x;
    const dy = this.path.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy) - 20;

    if (distance > 29) { // 29 - attack range + collision radius
      this.updateState('follow', this.path);

      return;
    }

    this._client.sendPacket(new serverPackets.Attack(this, npc.objectId));

    if (npc.job === 'patrol') {
      setTimeout(() => {
        npc.job = 'attack';
        npc.target = this.objectId;
        npc.updateState('stop'); // attack, if attack = stop > attack or follow
      }, 500000 / 330 / 2);
    }

    if (npc.hp >= 0) {
      setTimeout(() => {
        npc.hp = npc.hp - 10;

        //
        if (npc.hp <= 0) {
          this._client.sendPacket(new serverPackets.StatusUpdate(objectId, 0, npc.maximumHp));
          this._client.sendPacket(new serverPackets.Die(npc.objectId));
          
          npc.job = 'dead';
          npc.updateState('stop');
          npc.emit('died');
          
          this.isAttacking = false;

          setTimeout(() => {
            const spawnedNpcs = npcManager.getSpawnedNpcs();
        
            spawnedNpcs.forEach(npc => {
              this._client.sendPacket(new serverPackets.NpcInfo(npc));
            });
          }, 1000);
    
          setTimeout(() => {
            this._client.sendPacket(new serverPackets.AutoAttackStop(this.objectId));
            this._client.sendPacket(new serverPackets.DeleteObject(npc.objectId));
          }, 3000);
    
          return;
        }
        //

        this._client.sendPacket(new serverPackets.StatusUpdate(objectId, npc.hp, npc.maximumHp));
      }, 500000 / 330 / 2);
  
      setTimeout(() => {
        if (npc.hp <= 0) {
          this._client.sendPacket(new serverPackets.AutoAttackStop(this.objectId));

          return;
        }

        this.updateState('attack', this.target);
      }, 500000 / 330);
    }
  }

  stop() {
    movingManager.unregisterMovingObject(this);
    
    this.isMoving = false;

    // fix дождатся остановки перемещения(удаления из таймера)
    setTimeout(() => {
      if (this.job === 'attack') {
        this.updateState('attack', this.target);
      }
    }, 200);
  }

  update(data) { // remove
    for(const key in data) {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  updateParams(data) {
    for(const key in data) {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  updatePosition(tick) {
    const dx = this.path.target.x - this.x;
    const dy = this.path.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy) - 9;
    const time = (tick  - this.positionUpdateTimestamp) / 1000;
    
    if (distance < (this.runSpeed / 10)) {  
      const angle = Math.atan2(this.path.target.y - this.path.origin.y, this.path.target.x - this.path.origin.x);

      this.update({
        x: parseFloat((this.x + (Math.cos(angle) * distance)).toFixed(1)),
        y: parseFloat((this.y + (Math.sin(angle) * distance)).toFixed(1)),
        z: this.z
      });

      //
      this._client.sendPacket(new serverPackets.DropItem(this, {
        objectId: objectId,
        itemId: 118,
        x: this.x,
        y: this.y,
        z: this.z
      }));
  
      setTimeout((function(client, objId) {
        return function() {
          client.sendPacket(new serverPackets.DeleteObject(objId));
        }
      })(this._client, objectId), 5000);
  
      objectId++;
      //
  
      this.positionUpdateTimestamp = tick;

      this.updateState('stop');

      return;
    }

    const step = this.runSpeed * time;
    const angle = Math.atan2(this.path.target.y - this.path.origin.y, this.path.target.x - this.path.origin.x);

    this.update({
      x: parseFloat((this.x + (Math.cos(angle) * step)).toFixed(1)),
      y: parseFloat((this.y + (Math.sin(angle) * step)).toFixed(1)),
      z: this.z
    });

    //
    this._client.sendPacket(new serverPackets.DropItem(this, {
      objectId: objectId,
      itemId: 57,
      x: this.x,
      y: this.y,
      z: this.z
    }));

    setTimeout((function(client, objId) {
      return function() {
        client.sendPacket(new serverPackets.DeleteObject(objId));
      }
    })(this._client, objectId), 5000);

    objectId++;
    //

    this.positionUpdateTimestamp = tick;
  }
}

module.exports = Player;