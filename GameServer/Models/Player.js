const Character = require('./Character');
const serverPackets = require('./../ServerPackets/serverPackets');

class Player extends Character {
  constructor(client) {
    super();

    this._client = client;
    this.target = null;
    // this characterObjectId fix
    // this getActiveChar ?
  }

  getClient() {
    return this._client;
  }

  update(data) {
    for(const key in data) {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  attack(objectId) {    
    this._client.sendPacket(new serverPackets.Attack(this, objectId));
  }
}

module.exports = Player;