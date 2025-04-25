const EventEmitter = require('events');

class PlayersManager extends EventEmitter {
  constructor() {
    super();
    
    this._players = [];

    this.on('notify', packet => {
      this._players.forEach(player => {
        const client = player.getClient();

        client.sendPacket(packet);
      })
    })
  }

  add(player) {
    this._players.push(player);

    player.on('move', () => {
      this.emit('move', player);
    })

    player.on('pickup', (item) => {
      this.emit('pickup', player, item); // fix?
    });
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

module.exports = new PlayersManager();