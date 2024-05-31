const Character = require('./Character');

class Npc extends Character {
  constructor() {
    super();

    this.id = null;
    this.type = null;
    this.attackRange = null;
    this.attacked = null;
    this.aggressive = null;
    this.rightHand = null;
    this.leftHand = null;
    this.armor = null;
    this.class = null;
    this.collisionRadius = null;
    this.collisionHeight = null;
  }

  get runSpeed() {
    return Math.round(this.baseRunSpeed * 1.1); //fix
  }

  get walkSpeed() {
    return Math.round(this.baseWalkSpeed * 1.1);
  }

  update(data) {
    for(const key in data) {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }
}

module.exports = Npc;