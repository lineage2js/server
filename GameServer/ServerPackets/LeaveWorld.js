const ServerPacket = require('./ServerPacket.js'); 

class LeaveWorld {
  constructor() {
    this._packet = new ServerPacket(1);
    this._packet.writeC(0x96);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = LeaveWorld;