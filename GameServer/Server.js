const net = require('net');
const Client = require('./Client');
const config = require('./../config');
const Player = require('./Models/Player');
const players = require('./Models/Players');

class Server {
  constructor() {
    this._server = null;
  }

  start(callback) {
    this._server = net.createServer(this._handler.bind(this));
    
    this._server.on('listening', this._onListening.bind(this, callback));
    this._server.on('connection', this._onConnection);
    this._server.listen(config.gameserver.port, config.gameserver.host);
  }

  _onListening(callback) {
    console.log(`game server listening on ${config.gameserver.host}:${config.gameserver.port}`);
    
    callback()
  }

  _onConnection() {
    console.log('client connection');
  }

  _handler(socket) {
    const client = new Client(socket);
    const player = new Player(client);

    players.add(player);
  }
}

module.exports = Server;