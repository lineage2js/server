const net = require('net');
const Client = require('./Client');
const config = require('./../config');

class Server {
  constructor() {
    this._server = null;
  }

  start(callback) {
    this._server = net.createServer(this._handler.bind(this));

    this._server.on('listening', this._onListening.bind(this, callback));
    this._server.on('connection', this._onConnection);
    this._server.listen(config.loginserver.port, config.loginserver.host);
  }

  _onListening(callback) {
    console.log(`login server listening on ${config.loginserver.host}:${config.loginserver.port}`);

    callback();
  }

  _onConnection() {
    console.log('client connection');
  }

  _handler(socket) {
    new Client(socket);
  }
}

module.exports = Server;