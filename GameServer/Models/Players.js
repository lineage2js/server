class Players {
  constructor() {
    this._players = [];
  }

  add(player) {
    this._players.push(player);
  }

  getPlayerByClient(client) {
    const player = this._players.find((player) => {
      if (player.getClient() === client) {
        return true;
      } else {
        return false;
      }
    });

    return player;
  }
}

module.exports = new Players();