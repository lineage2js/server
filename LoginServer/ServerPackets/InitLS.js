const ServerPacket = require('./ServerPacket.js'); 

class InitLS {
  constructor() {
    this._sessionID = 0x03ed779c;
    this._packet = new ServerPacket(9);
    this._packet.writeC(0x00)
      .writeD(this._sessionID)
      .writeD(30810); // Protocol version
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = InitLS;