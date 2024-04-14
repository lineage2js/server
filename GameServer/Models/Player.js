const Character = require('./Character');

class Player extends Character {
  constructor(client) {
    super();

    this._client = client;
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
}

module.exports = Player;